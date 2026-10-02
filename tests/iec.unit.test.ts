import { describe, expect, test, beforeEach, afterEach, jest } from '@jest/globals';
import { buildQuery, buildEndpoint, IEC } from '../src/iec';

describe('buildQuery / buildEndpoint', () => {
    test('buildQuery skips undefined and null', () => {
        expect(buildQuery({ a: 1, b: undefined, c: null, d: 'x' })).toBe('a=1&d=x');
    });

    test('buildQuery encodes values', () => {
        expect(buildQuery({ Name: 'A & B' })).toBe('Name=A%20%26%20B');
    });

    test('buildEndpoint without params', () => {
        expect(buildEndpoint('LGEBallotResults')).toBe('LGEBallotResults');
    });

    test('buildEndpoint with params', () => {
        expect(buildEndpoint('LGEBallotResults', {
            ElectoralEventID: 123,
            ProvinceID: 3,
        })).toBe('LGEBallotResults?ElectoralEventID=123&ProvinceID=3');
    });

    test('buildEndpoint omits empty query', () => {
        expect(buildEndpoint('ElectoralEvent', { ParentEventID: undefined })).toBe('ElectoralEvent');
    });
});

describe('IEC URL construction (mocked fetch)', () => {
    const originalFetch = global.fetch;
    let fetchMock: jest.MockedFunction<typeof fetch>;
    let iec: IEC;

    beforeEach(() => {
        fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
        global.fetch = fetchMock;
        iec = new IEC({
            username: 'test-user',
            password: 'test-pass',
            url: 'https://example.test',
        });
        iec._loggedIn = true;
        iec._token = {
            access_token: 'tok',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'r',
            userName: 'test-user',
            '.issued': new Date().toISOString(),
            '.expires': new Date(Date.now() + 3600_000).toISOString(),
        };
    });

    afterEach(() => {
        global.fetch = originalFetch;
    });

    function mockJson(body: unknown, ok = true, status = 200) {
        const payload = JSON.stringify(body);
        fetchMock.mockResolvedValue({
            ok,
            status,
            statusText: ok ? 'OK' : 'Error',
            text: async () => payload,
            json: async () => body,
        } as Response);
    }

    async function lastUrl(): Promise<string> {
        expect(fetchMock).toHaveBeenCalled();
        const [url] = fetchMock.mock.calls[fetchMock.mock.calls.length - 1]!;
        return String(url);
    }

    function tokenResponse(overrides: Partial<{
        access_token: string;
        refresh_token: string;
        expiresAt: Date;
    }> = {}) {
        const expiresAt = overrides.expiresAt ?? new Date(Date.now() + 3600_000);
        return {
            access_token: overrides.access_token ?? 'abc',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: overrides.refresh_token ?? 'r',
            userName: 'test-user',
            '.issued': new Date().toISOString(),
            '.expires': expiresAt.toISOString(),
        };
    }

    test('login posts token endpoint', async () => {
        iec._loggedIn = false;
        iec._token = undefined;
        mockJson(tokenResponse({ access_token: 'abc' }));
        await iec.login();
        expect(String(fetchMock.mock.calls[0]![0])).toBe('https://example.test/token');
        const body = String(fetchMock.mock.calls[0]![1]?.body);
        expect(body).toContain('grant_type=password');
    });

    test('isTokenValid respects expiry skew', () => {
        iec._token = tokenResponse({
            expiresAt: new Date(Date.now() + 30_000), // within 60s skew
        });
        expect(iec.isTokenValid()).toBe(false);

        iec._token = tokenResponse({
            expiresAt: new Date(Date.now() + 120_000),
        });
        expect(iec.isTokenValid()).toBe(true);
    });

    test('get re-logs in when access token is expired', async () => {
        iec._token = tokenResponse({
            access_token: 'stale',
            refresh_token: 'refresh-me',
            expiresAt: new Date(Date.now() - 60_000),
        });
        iec._loggedIn = true;

        fetchMock
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => '',
                json: async () => tokenResponse({
                    access_token: 'fresh',
                    refresh_token: 'refresh-me',
                }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => JSON.stringify([{ ID: 1 }]),
                json: async () => [{ ID: 1 }],
            } as Response);

        const result = await iec.get('ElectoralEvent');
        expect(result).toEqual([{ ID: 1 }]);
        expect(String(fetchMock.mock.calls[0]![0])).toBe('https://example.test/token');
        const loginBody = String(fetchMock.mock.calls[0]![1]?.body);
        expect(loginBody).toContain('grant_type=refresh_token');
        expect(loginBody).toContain('refresh_token=refresh-me');
        expect(String(fetchMock.mock.calls[1]![0])).toContain('/api/v1/ElectoralEvent');
        const auth = (fetchMock.mock.calls[1]![1]?.headers as Record<string, string>)['Authorization'];
        expect(auth).toBe('Bearer fresh');
    });

    test('get falls back to password grant when refresh fails', async () => {
        iec._token = tokenResponse({
            access_token: 'stale',
            refresh_token: 'dead-refresh',
            expiresAt: new Date(Date.now() - 60_000),
        });
        iec._loggedIn = true;

        fetchMock
            .mockResolvedValueOnce({
                ok: false,
                status: 400,
                statusText: 'Bad Request',
                text: async () => '',
                json: async () => ({ error: 'invalid_grant' }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => '',
                json: async () => tokenResponse({ access_token: 'password-fresh' }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => JSON.stringify([]),
                json: async () => [],
            } as Response);

        await iec.get('ElectoralEvent');
        expect(String(fetchMock.mock.calls[0]![1]?.body)).toContain('grant_type=refresh_token');
        expect(String(fetchMock.mock.calls[1]![1]?.body)).toContain('grant_type=password');
        const auth = (fetchMock.mock.calls[2]![1]?.headers as Record<string, string>)['Authorization'];
        expect(auth).toBe('Bearer password-fresh');
    });

    test('get retries once after 401 Unauthorized', async () => {
        fetchMock
            .mockResolvedValueOnce({
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
                text: async () => JSON.stringify({ Message: 'Authorization has been denied for this request.' }),
                json: async () => ({ Message: 'Authorization has been denied for this request.' }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => '',
                json: async () => tokenResponse({ access_token: 'after-401' }),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => JSON.stringify({ ok: true }),
                json: async () => ({ ok: true }),
            } as Response);

        const result = await iec.get('ElectoralEvent');
        expect(result).toEqual({ ok: true });
        expect(fetchMock).toHaveBeenCalledTimes(3);
        expect(String(fetchMock.mock.calls[1]![0])).toBe('https://example.test/token');
        const auth = (fetchMock.mock.calls[2]![1]?.headers as Record<string, string>)['Authorization'];
        expect(auth).toBe('Bearer after-401');
    });

    test('get does not retry 401 indefinitely', async () => {
        fetchMock
            .mockResolvedValueOnce({
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
                text: async () => '',
                json: async () => ({}),
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                statusText: 'OK',
                text: async () => '',
                json: async () => tokenResponse({ access_token: 'still-bad' }),
            } as Response)
            .mockResolvedValueOnce({
                ok: false,
                status: 401,
                statusText: 'Unauthorized',
                text: async () => '',
                json: async () => ({}),
            } as Response);

        await expect(iec.get('ElectoralEvent')).rejects.toThrow(/Request failed: 401/);
        expect(fetchMock).toHaveBeenCalledTimes(3);
    });

    test('get throws on HTTP error', async () => {
        mockJson({}, false, 500);
        await expect(iec.get('ElectoralEvent')).rejects.toThrow(/Request failed: 500/);
    });

    test('get throws on Message field', async () => {
        mockJson({ Message: 'No data' });
        await expect(iec.get('ElectoralEvent')).rejects.toThrow('No data');
    });

    test('electoralEvents includes ParentEventID when provided', async () => {
        mockJson([]);
        await iec.electoralEvents(3, 99);
        expect(await lastUrl()).toContain(
            'ElectoralEvent?ElectoralEventTypeID=3&ParentEventID=99'
        );
    });

    test('progress municipality includes ProvinceID', async () => {
        mockJson({ VDResultsIn: 0, VDTotal: 1, SeatCalculationCompleted: false });
        await iec.electoralEventProgressMunicipality(10, 2, 300);
        expect(await lastUrl()).toBe(
            'https://example.test/api/v1/ResultsProgress?ElectoralEventID=10&ProvinceID=2&MunicipalityID=300'
        );
    });

    test('progress ward includes ProvinceID', async () => {
        mockJson({ VDResultsIn: 0, VDTotal: 1, SeatCalculationCompleted: false });
        await iec.electoralEventProgressWard(10, 2, 300, 400);
        expect(await lastUrl()).toBe(
            'https://example.test/api/v1/ResultsProgress?ElectoralEventID=10&ProvinceID=2&MunicipalityID=300&WardID=400'
        );
    });

    test('contestingParties scopes', async () => {
        mockJson([]);
        await iec.contestingParties(10, 2, 300);
        expect(await lastUrl()).toContain(
            'ContestingParties?ElectoralEventID=10&ProvinceID=2&MunicipalityID=300'
        );
    });

    test('LGEBallotResults scopes', async () => {
        mockJson({ PartyBallotResults: [] });
        await iec.LGEBallotResults(10);
        expect(await lastUrl()).toContain('LGEBallotResults?ElectoralEventID=10');

        await iec.LGEBallotResultsProvince(10, 2);
        expect(await lastUrl()).toContain('ProvinceID=2');

        await iec.LGEBallotResultsMunicipality(10, 2, 300);
        expect(await lastUrl()).toContain('MunicipalityID=300');

        await iec.LGEBallotResultsWard(10, 2, 300, 400);
        expect(await lastUrl()).toContain('WardID=400');

        await iec.LGEBallotResultsVotingDistrict(10, 2, 300, 500);
        expect(await lastUrl()).toContain('VDNumber=500');
    });

    test('LGESeatCalculationResults', async () => {
        mockJson({ PartyResults: [] });
        await iec.LGESeatCalculationResults(10, 300);
        expect(await lastUrl()).toBe(
            'https://example.test/api/v1/LGESeatCalculationResults?ElectoralEventID=10&MunicipalityID=300'
        );
    });

    test('NPECandidates national and province', async () => {
        mockJson([]);
        await iec.NPECandidates(10, 42);
        expect(await lastUrl()).toBe(
            'https://example.test/api/v1/NPECandidates?ElectoralEventID=10&PartyID=42'
        );

        await iec.NPECandidatesProvince(10, 2, 42);
        expect(await lastUrl()).toBe(
            'https://example.test/api/v1/NPECandidates?ElectoralEventID=10&ProvinceID=2&PartyID=42'
        );
    });

    test('LGECandidates ward and municipality', async () => {
        mockJson([]);
        await iec.LGECandidatesByWard(10, 400);
        expect(await lastUrl()).toContain('LGECandidates?ElectoralEventID=10&WardID=400');

        await iec.LGECandidatesByMunicipality(10, 300);
        expect(await lastUrl()).toContain(
            'LGECandidates?ElectoralEventID=10&MunicipalityID=300'
        );
    });

    test('LGEWardCouncilor and CouncilorsByEvent', async () => {
        mockJson({ Name: 'x' });
        await iec.LGEWardCouncilor(400);
        expect(await lastUrl()).toContain('LGEWardCouncilor?WardID=400');

        await iec.LGEWardCouncilorByLatLong(-26.2, 28.0);
        expect(await lastUrl()).toContain('Latitude=-26.2&Longitude=28');

        mockJson([]);
        await iec.LGECouncilorsByEvent(10);
        expect(await lastUrl()).toContain('CouncilorsByEvent?ElectoralEventID=10');
    });

    test('LatestResultsIn and voting stations', async () => {
        mockJson([]);
        await iec.LatestResultsIn(10, 5);
        expect(await lastUrl()).toContain(
            'LatestResultsIn?ElectoralEventID=10&NumberOfVDs=5'
        );

        mockJson({});
        await iec.VotingStationDetailsByVD(12345);
        expect(await lastUrl()).toContain('VotingStationDetails?VDNumber=12345');

        await iec.VotingStationDetailsByLocation(-26.2, 28.0);
        expect(await lastUrl()).toContain('Latitude=-26.2&Longitude=28');

        mockJson([]);
        await iec.VotingStationsByEvent(10);
        expect(await lastUrl()).toContain('VotingStations?ElectoralEventID=10');
    });
});
