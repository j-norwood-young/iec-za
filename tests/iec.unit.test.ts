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

    test('login posts token endpoint', async () => {
        iec._loggedIn = false;
        iec._token = undefined;
        mockJson({
            access_token: 'abc',
            token_type: 'bearer',
            expires_in: 3600,
            refresh_token: 'r',
            userName: 'test-user',
            '.issued': new Date().toISOString(),
            '.expires': new Date(Date.now() + 3600_000).toISOString(),
        });
        await iec.login();
        expect(String(fetchMock.mock.calls[0]![0])).toBe('https://example.test/token');
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
