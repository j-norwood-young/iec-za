import { IEC } from '../src/iec';

const hasCreds = Boolean(process.env.IEC_USERNAME && process.env.IEC_PASSWORD);
const describeIfLive = hasCreds ? describe : describe.skip;

/**
 * Live LGE coverage against a historical Local Government Election (2021 preferred).
 * Discovers IDs at runtime — no hard-coded IEC event IDs.
 */
describeIfLive('IEC live LGE 2021', () => {
    const iec = new IEC();

    let lgeTypeId: number;
    let lgeEventId: number;
    let provinceId: number;
    let municipalityId: number;
    let wardId: number;
    let vdNumber: number;

    test('discover Local Government Election type and 2021 event', async () => {
        const types = await iec.electoralEventTypes();
        expect(types.length).toBeGreaterThanOrEqual(4);

        const lgeType = types.find((t) =>
            /local\s+government/i.test(t.Description)
        );
        expect(lgeType).toBeDefined();
        lgeTypeId = lgeType!.ID;

        const events = await iec.electoralEvents(lgeTypeId);
        expect(events.length).toBeGreaterThan(0);

        const event2021 = events.find((e) => e.Description.includes('2021'));
        expect(event2021).toBeDefined();
        lgeEventId = event2021!.ID;
        console.log(
            `LGE fixture: type=${lgeTypeId} event=${lgeEventId} (${event2021!.Description})`
        );
    }, 60000);

    test('traverse delimitation province → municipality → ward → VD', async () => {
        const provinces = await iec.delimitations(lgeEventId);
        expect(provinces.length).toBeGreaterThan(0);
        // Prefer a non-"out of country" style province if present
        const province =
            provinces.find((p) => /gauteng/i.test(p.Province)) ?? provinces[0]!;
        provinceId = province.ProvinceID;

        const municipalities = await iec.delimitationsProvince(lgeEventId, provinceId);
        expect(municipalities.length).toBeGreaterThan(0);
        const municipality =
            municipalities.find((m) => /johannesburg|tshwane|ekurhuleni/i.test(m.Municipality)) ??
            municipalities[0]!;
        municipalityId = municipality.MunicipalityID;

        const wards = await iec.delimitationsMunicipality(
            lgeEventId,
            provinceId,
            municipalityId
        );
        expect(wards.length).toBeGreaterThan(0);
        wardId = wards[0]!.WardID;

        const vds = await iec.delimitationsWard(
            lgeEventId,
            provinceId,
            municipalityId,
            wardId
        );
        expect(vds.length).toBeGreaterThan(0);
        vdNumber = vds[0]!.VDNumber;

        console.log(
            `LGE traversal: province=${provinceId} municipality=${municipalityId} ward=${wardId} vd=${vdNumber}`
        );
    }, 120000);

    test('LGEBallotResults national', async () => {
        const results = await iec.LGEBallotResults(lgeEventId);
        expect(results.ElectoralEventID).toBe(lgeEventId);
        expect(results.VDCount).toBeGreaterThan(0);
        expect(results.PartyBallotResults.length).toBeGreaterThan(0);
        const party = results.PartyBallotResults[0]!;
        expect(party.ID).toBeDefined();
        expect(party.Name).toBeDefined();
        expect(party.TotalValidVotes).toBeGreaterThanOrEqual(0);
        expect(party.Ward_ValidVotes).toBeGreaterThanOrEqual(0);
        expect(party.PR_ValidVotes).toBeGreaterThanOrEqual(0);
    }, 120000);

    test('LGEBallotResults province', async () => {
        const results = await iec.LGEBallotResultsProvince(lgeEventId, provinceId);
        expect(results.ElectoralEventID).toBe(lgeEventId);
        expect(results.ProvinceID).toBe(provinceId);
        expect(results.PartyBallotResults.length).toBeGreaterThan(0);
    }, 120000);

    test('LGEBallotResults municipality', async () => {
        const results = await iec.LGEBallotResultsMunicipality(
            lgeEventId,
            provinceId,
            municipalityId
        );
        expect(results.ElectoralEventID).toBe(lgeEventId);
        expect(results.MunicipalityID).toBe(municipalityId);
        expect(results.PartyBallotResults.length).toBeGreaterThan(0);
    }, 120000);

    test('LGEBallotResults ward', async () => {
        const results = await iec.LGEBallotResultsWard(
            lgeEventId,
            provinceId,
            municipalityId,
            wardId
        );
        expect(results.ElectoralEventID).toBe(lgeEventId);
        expect(results.PartyBallotResults.length).toBeGreaterThan(0);
    }, 120000);

    test('LGEBallotResults voting district', async () => {
        const results = await iec.LGEBallotResultsVotingDistrict(
            lgeEventId,
            provinceId,
            municipalityId,
            vdNumber
        );
        expect(results.ElectoralEventID).toBe(lgeEventId);
        expect(results.PartyBallotResults.length).toBeGreaterThan(0);
    }, 120000);

    test('LGESeatCalculationResults municipality', async () => {
        const seats = await iec.LGESeatCalculationResults(lgeEventId, municipalityId);
        expect(seats.ElectoralEventID).toBe(lgeEventId);
        expect(seats.MunicipalityID).toBe(municipalityId);
        expect(seats.TotalSeatsAvailable).toBeGreaterThan(0);
        expect(seats.PartyResults.length).toBeGreaterThan(0);
        expect(seats.PartyResults[0]!.TotalPartySeats).toBeGreaterThanOrEqual(0);
        expect(seats.PartyResults[0]!.WardSeats).toBeGreaterThanOrEqual(0);
        expect(seats.PartyResults[0]!.PRSeats).toBeGreaterThanOrEqual(0);
    }, 120000);

    test('LGECandidates by ward and municipality', async () => {
        const wardCandidates = await iec.LGECandidatesByWard(lgeEventId, wardId);
        expect(Array.isArray(wardCandidates)).toBe(true);
        if (wardCandidates.length > 0) {
            expect(wardCandidates[0]!.CandidateID).toBeDefined();
            expect(wardCandidates[0]!.PartyName).toBeDefined();
            expect(wardCandidates[0]!.Surname).toBeDefined();
        }

        const prCandidates = await iec.LGECandidatesByMunicipality(
            lgeEventId,
            municipalityId
        );
        expect(Array.isArray(prCandidates)).toBe(true);
        if (prCandidates.length > 0) {
            expect(prCandidates[0]!.CandidateID).toBeDefined();
            expect(prCandidates[0]!.ListOrderNo).toBeDefined();
        }
    }, 120000);

    test('LGEWardCouncilor and CouncilorsByEvent', async () => {
        const councilor = await iec.LGEWardCouncilor(wardId);
        expect(councilor).toBeDefined();
        expect(councilor.WardID === wardId || councilor.Name).toBeTruthy();

        const byEvent = await iec.LGECouncilorsByEvent(lgeEventId);
        const list = Array.isArray(byEvent) ? byEvent : [byEvent];
        expect(list.length).toBeGreaterThan(0);
        expect(list[0]!.Name || list[0]!.WardID).toBeTruthy();
    }, 180000);

    test('ResultsProgress LGE scopes', async () => {
        const national = await iec.electoralEventResultsProgress(lgeEventId);
        expect(national.VDTotal).toBeGreaterThan(0);

        const byProvince = await iec.electoralEventProgressProvince(
            lgeEventId,
            provinceId
        );
        expect(byProvince.VDTotal).toBeGreaterThan(0);

        const byMunicipality = await iec.electoralEventProgressMunicipality(
            lgeEventId,
            provinceId,
            municipalityId
        );
        expect(byMunicipality.VDTotal).toBeGreaterThan(0);

        const byWard = await iec.electoralEventProgressWard(
            lgeEventId,
            provinceId,
            municipalityId,
            wardId
        );
        expect(byWard.VDTotal).toBeGreaterThan(0);
    }, 120000);

    test('contestingParties LGE scopes', async () => {
        const national = await iec.contestingParties(lgeEventId);
        expect(national.length).toBeGreaterThan(0);

        const byProvince = await iec.contestingParties(lgeEventId, provinceId);
        expect(byProvince.length).toBeGreaterThan(0);

        const byMunicipality = await iec.contestingParties(
            lgeEventId,
            provinceId,
            municipalityId
        );
        expect(byMunicipality.length).toBeGreaterThan(0);
    }, 120000);

    test('LatestResultsIn and VotingStationDetails', async () => {
        const latest = await iec.LatestResultsIn(lgeEventId, 3);
        expect(Array.isArray(latest)).toBe(true);

        const station = await iec.VotingStationDetailsByVD(vdNumber);
        expect(station).toBeDefined();
    }, 120000);
});
