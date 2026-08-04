import { IEC } from '../src/iec';
import type { IECTokenResponse } from '../src/iec';

const hasCreds = Boolean(process.env.IEC_USERNAME && process.env.IEC_PASSWORD);
const describeIfLive = hasCreds ? describe : describe.skip;

describeIfLive('IEC live NPE', () => {
    const iec = new IEC();

    let token: IECTokenResponse;
    let electionType: number;
    let electoralEvent: number;
    let province: number;
    let municipality: number;
    let ward: number;
    let vd: number;
    let party: number;
    const lat = -28.4792625;
    const lng = 24.6727135;

    test('IEC.login', async () => {
        token = await iec.login();
        expect(token).toBeDefined();
        expect(token.access_token).toBeDefined();
        expect(token.token_type).toBeDefined();
        expect(token.expires_in).toBeDefined();
        expect(token.userName).toBeDefined();
        expect(token['.issued']).toBeDefined();
        expect(token['.expires']).toBeDefined();
    });

    test('IEC.login with token', async () => {
        const new_token: IECTokenResponse = await iec.login(token);
        expect(token).toBeDefined();
        expect(new_token.access_token).toBe(token.access_token);
    });

    test('IEC.electoralEventTypes', async () => {
        const electoralEventTypes = await iec.electoralEventTypes();
        expect(electoralEventTypes).toBeDefined();
        expect(electoralEventTypes.length).toBeGreaterThan(0);
        expect(electoralEventTypes[0]!.ID).toBeDefined();
        expect(electoralEventTypes[0]!.Description).toBeDefined();
        const national = electoralEventTypes.find((t) =>
            /national/i.test(t.Description)
        );
        electionType = (national ?? electoralEventTypes[0]!).ID;
    });

    test('IEC.electoralEvents', async () => {
        const electoralEvents = await iec.electoralEvents(electionType);
        expect(electoralEvents).toBeDefined();
        expect(electoralEvents.length).toBeGreaterThan(0);
        expect(electoralEvents[0]!.ID).toBeDefined();
        expect(electoralEvents[0]!.Description).toBeDefined();
        expect(electoralEvents[0]!.IsActive).toBeDefined();
        const with2019 = electoralEvents.find((e) => e.Description.includes('2019'));
        electoralEvent = (with2019 ?? electoralEvents[1] ?? electoralEvents[0]!).ID;
    });

    test('IEC.delimitations', async () => {
        const provinces = await iec.delimitations(electoralEvent);
        expect(provinces).toBeDefined();
        expect(provinces.length).toBeGreaterThan(0);
        expect(provinces[0]!.ProvinceID).toBeDefined();
        expect(provinces[0]!.Province).toBeDefined();
        province = provinces[0]!.ProvinceID;
    });

    test('IEC.delimitationsProvince', async () => {
        const municipalities = await iec.delimitationsProvince(electoralEvent, province);
        expect(municipalities).toBeDefined();
        expect(municipalities.length).toBeGreaterThan(0);
        expect(municipalities[0]!.MunicipalityID).toBeDefined();
        expect(municipalities[0]!.Municipality).toBeDefined();
        municipality = municipalities[0]!.MunicipalityID;
    });

    test('IEC.delimitationsMunicipality', async () => {
        const wards = await iec.delimitationsMunicipality(
            electoralEvent,
            province,
            municipality
        );
        expect(wards).toBeDefined();
        expect(wards.length).toBeGreaterThan(0);
        expect(wards[0]!.WardID).toBeDefined();
        ward = wards[0]!.WardID;
    });

    test('IEC.delimitationsWard', async () => {
        const vds = await iec.delimitationsWard(
            electoralEvent,
            province,
            municipality,
            ward
        );
        expect(vds).toBeDefined();
        expect(vds.length).toBeGreaterThan(0);
        expect(vds[0]!.VDNumber).toBeDefined();
        vd = vds[0]!.VDNumber;
    });

    test('IEC.contestingParties', async () => {
        const contestingParties = await iec.contestingParties(electoralEvent);
        expect(contestingParties).toBeDefined();
        expect(contestingParties.length).toBeGreaterThan(0);
        expect(contestingParties[0]!.ID).toBeDefined();
        expect(contestingParties[0]!.Name).toBeDefined();
        expect(contestingParties[0]!.LogoUrl).toBeDefined();
        expect(contestingParties[0]!.Abbreviation).toBeDefined();
        party = contestingParties[0]!.ID;
    });

    test('IEC.electoralEventResultsProgress', async () => {
        const electoralEventResultsProgress =
            await iec.electoralEventResultsProgress(electoralEvent);
        expect(electoralEventResultsProgress).toBeDefined();
        expect(electoralEventResultsProgress.VDResultsIn).toBeGreaterThan(0);
        expect(electoralEventResultsProgress.VDTotal).toBeGreaterThan(0);
        expect(electoralEventResultsProgress.SeatCalculationCompleted).toBeDefined();
    });

    test('IEC.electoralEventProgressProvince', async () => {
        const electoralEventProgressProvince = await iec.electoralEventProgressProvince(
            electoralEvent,
            province
        );
        expect(electoralEventProgressProvince).toBeDefined();
        expect(electoralEventProgressProvince.VDResultsIn).toBeGreaterThan(0);
        expect(electoralEventProgressProvince.VDTotal).toBeGreaterThan(0);
        expect(electoralEventProgressProvince.SeatCalculationCompleted).toBeDefined();
    });

    test('IEC.electoralEventProgressMunicipality', async () => {
        const electoralEventProgressMunicipality =
            await iec.electoralEventProgressMunicipality(
                electoralEvent,
                province,
                municipality
            );
        expect(electoralEventProgressMunicipality).toBeDefined();
        expect(electoralEventProgressMunicipality.VDResultsIn).toBeGreaterThanOrEqual(0);
        expect(electoralEventProgressMunicipality.VDTotal).toBeGreaterThan(0);
        expect(electoralEventProgressMunicipality.SeatCalculationCompleted).toBeDefined();
    });

    test('IEC.electoralEventProgressWard', async () => {
        const electoralEventProgressWard = await iec.electoralEventProgressWard(
            electoralEvent,
            province,
            municipality,
            ward
        );
        expect(electoralEventProgressWard).toBeDefined();
        expect(electoralEventProgressWard.VDResultsIn).toBeGreaterThanOrEqual(0);
        expect(electoralEventProgressWard.VDTotal).toBeGreaterThan(0);
        expect(electoralEventProgressWard.SeatCalculationCompleted).toBeDefined();
    });

    test('IEC.NPEBallotResults', async () => {
        const NPEBallotResults = await iec.NPEBallotResults(electoralEvent);
        expect(NPEBallotResults).toBeDefined();
        expect(NPEBallotResults.ElectoralEventID).toBeDefined();
        expect(NPEBallotResults.ElectoralEvent).toBeDefined();
        expect(NPEBallotResults.RegisteredVoters).toBeGreaterThan(0);
        expect(NPEBallotResults.SpoiltVotes).toBeGreaterThan(0);
        expect(NPEBallotResults.Section24AVotes).toBeDefined();
        expect(NPEBallotResults.SpecialVotes).toBeGreaterThan(0);
        expect(NPEBallotResults.PercVoterTurnout).toBeGreaterThan(0);
        expect(NPEBallotResults.TotalVotesCast).toBeGreaterThan(0);
        expect(NPEBallotResults.TotalValidVotes).toBeGreaterThan(0);
        expect(NPEBallotResults.VDCount).toBeGreaterThan(0);
        expect(NPEBallotResults.VDWithResultsCaptured).toBeGreaterThan(0);
        expect(NPEBallotResults.bResultsComplete).toBeDefined();
        expect(NPEBallotResults.PartyBallotResults).toBeDefined();
        expect(NPEBallotResults.PartyBallotResults.length).toBeGreaterThan(0);
        expect(NPEBallotResults.PartyBallotResults[0]!.ID).toBeDefined();
        expect(NPEBallotResults.PartyBallotResults[0]!.Name).toBeDefined();
        expect(NPEBallotResults.PartyBallotResults[0]!.ValidVotes).toBeGreaterThan(0);
        expect(NPEBallotResults.PartyBallotResults[0]!.PercOfVotes).toBeGreaterThan(0);
        expect(NPEBallotResults.PartyBallotResults[0]!.PartyAbbr).toBeDefined();
    });

    test('IEC.NPEBallotResultsProvince', async () => {
        const NPEBallotResultsProvince = await iec.NPEBallotResultsProvince(
            electoralEvent,
            province
        );
        expect(NPEBallotResultsProvince).toBeDefined();
        expect(NPEBallotResultsProvince.ElectoralEventID).toBeDefined();
        expect(NPEBallotResultsProvince.ProvinceID).toBe(province);
        expect(NPEBallotResultsProvince.PartyBallotResults.length).toBeGreaterThan(0);
    });

    test('IEC.NPEBallotResultsMunicipality', async () => {
        const NPEBallotResultsMunicipality = await iec.NPEBallotResultsMunicipality(
            electoralEvent,
            province,
            municipality
        );
        expect(NPEBallotResultsMunicipality).toBeDefined();
        expect(NPEBallotResultsMunicipality.MunicipalityID).toBe(municipality);
        expect(NPEBallotResultsMunicipality.PartyBallotResults.length).toBeGreaterThan(0);
    });

    test('IEC.NPEBallotResultsVotingDistrict', async () => {
        const NPEBallotResultsVotingDistrict = await iec.NPEBallotResultsVotingDistrict(
            electoralEvent,
            province,
            municipality,
            vd
        );
        expect(NPEBallotResultsVotingDistrict).toBeDefined();
        expect(NPEBallotResultsVotingDistrict.VDNumber).toBe(vd);
        expect(NPEBallotResultsVotingDistrict.PartyBallotResults.length).toBeGreaterThan(0);
    });

    test('IEC.NPESeatCalculationResults', async () => {
        const NPESeatCalculationResults =
            await iec.NPESeatCalculationResults(electoralEvent);
        expect(NPESeatCalculationResults).toBeDefined();
        expect(NPESeatCalculationResults.ElectoralEventID).toBe(electoralEvent);
        expect(NPESeatCalculationResults.PartyResults.length).toBeGreaterThan(0);
        expect(NPESeatCalculationResults.PartyResults[0]!.Overall).toBeGreaterThanOrEqual(0);
    });

    test('IEC.NPESeatCalculationResultsProvince', async () => {
        const NPESeatCalculationResultsProvince =
            await iec.NPESeatCalculationResultsProvince(electoralEvent, province);
        expect(NPESeatCalculationResultsProvince).toBeDefined();
        expect(NPESeatCalculationResultsProvince.ProvinceID).toBe(province);
        expect(NPESeatCalculationResultsProvince.PartyResults.length).toBeGreaterThan(0);
    });

    test('NPESeatAllocationResults', async () => {
        const NPESeatAllocationResults = await iec.NPESeatAllocationResults(
            electoralEvent,
            party
        );
        expect(NPESeatAllocationResults).toBeDefined();
        expect(NPESeatAllocationResults.length).toBeGreaterThan(0);
        expect(NPESeatAllocationResults[0]!.ID).toBeDefined();
        expect(NPESeatAllocationResults[0]!.Rank).toBeDefined();
    });

    test('IEC.NPECandidates', async () => {
        const NPECandidates = await iec.NPECandidates(electoralEvent, party);
        expect(NPECandidates).toBeDefined();
        expect(NPECandidates.length).toBeGreaterThan(0);
        expect(NPECandidates[0]!.ID).toBeDefined();
        expect(NPECandidates[0]!.Surname).toBeDefined();
    });

    test('IEC.delimitationsLatLong', async () => {
        const delimitationsLatLong = await iec.delimitationsLatLong(lat, lng);
        expect(delimitationsLatLong).toBeDefined();
        expect(delimitationsLatLong.ProvinceID).toBeDefined();
        expect(delimitationsLatLong.MunicipalityID).toBeDefined();
        expect(delimitationsLatLong.WardID).toBeDefined();
        expect(delimitationsLatLong.VDNumber).toBeDefined();
    });
});
