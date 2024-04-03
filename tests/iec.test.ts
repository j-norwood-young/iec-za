import {IEC} from "../src/iec";
// import dotenv from "dotenv";
// dotenv.config();

// const username = process.env.IEC_USERNAME;
// const password = process.env.IEC_PASSWORD;
// if (!username || !password) {
//     throw new Error("Please set IEC_USERNAME and IEC_PASSWORD in .env file");
// }
// Connect to IEC
const iec = new IEC();
// beforeAll(async () =>{
//     await iec.login();
// });
import type {IECTokenResponse} from "../src/iec";

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
    expect(token[".issued"]).toBeDefined();
    expect(token[".expires"]).toBeDefined();
})

test('IEC.login with token', async () => {
    const new_token: IECTokenResponse = await iec.login(token);
    expect(token).toBeDefined();
    expect(new_token.access_token).toBe(token.access_token);
})

test('IEC.electoralEventTypes', async () => {
    const electoralEventTypes = await iec.electoralEventTypes();
    expect(electoralEventTypes).toBeDefined();
    expect(electoralEventTypes.length).toBeGreaterThan(0);
    expect(electoralEventTypes[0].ID).toBeDefined();
    expect(electoralEventTypes[0].Description).toBeDefined();
    electionType = electoralEventTypes[0].ID;
})

test('IEC.electoralEvents', async () => {
    const electoralEvents = await iec.electoralEvents(electionType);
    expect(electoralEvents).toBeDefined();
    expect(electoralEvents.length).toBeGreaterThan(0);
    expect(electoralEvents[0].ID).toBeDefined();
    expect(electoralEvents[0].Description).toBeDefined();
    expect(electoralEvents[0].IsActive).toBeDefined();
    electoralEvent = electoralEvents[1].ID;
})

test('IEC.delimitations', async () => {
    const provinces = await iec.delimitations(electoralEvent);
    expect(provinces).toBeDefined();
    expect(provinces.length).toBeGreaterThan(0);
    expect(provinces[0].ProvinceID).toBeDefined();
    expect(provinces[0].Province).toBeDefined();
    province = provinces[0].ProvinceID;
})

test('IEC.delimitationsProvince', async () => {
    const municipalities = await iec.delimitationsProvince(electoralEvent, province);
    expect(municipalities).toBeDefined();
    expect(municipalities.length).toBeGreaterThan(0);
    expect(municipalities[0].MunicipalityID).toBeDefined();
    expect(municipalities[0].Municipality).toBeDefined();
    municipality = municipalities[0].MunicipalityID;
})

test('IEC.delimitationsMunicipality', async () => {
    const wards = await iec.delimitationsMunicipality(electoralEvent, province, municipality);
    expect(wards).toBeDefined();
    expect(wards.length).toBeGreaterThan(0);
    expect(wards[0].WardID).toBeDefined();
    ward = wards[0].WardID;
})

test('IEC.delimitationsWard', async () => {
    const vds = await iec.delimitationsWard(electoralEvent, province, municipality, ward);
    expect(vds).toBeDefined();
    expect(vds.length).toBeGreaterThan(0);
    expect(vds[0].VDNumber).toBeDefined();
    vd = vds[0].VDNumber;
})

test('IEC.contestingParties', async () => {
    const contestingParties = await iec.contestingParties(electoralEvent);
    expect(contestingParties).toBeDefined();
    expect(contestingParties.length).toBeGreaterThan(0);
    expect(contestingParties[0].ID).toBeDefined();
    expect(contestingParties[0].Name).toBeDefined();
    expect(contestingParties[0].LogoUrl).toBeDefined();
    expect(contestingParties[0].Abbreviation).toBeDefined();
    party = contestingParties[0].ID;
})

test('IEC.electoralEventResultsProgress', async () => {
    const electoralEventResultsProgress = await iec.electoralEventResultsProgress(electoralEvent);
    expect(electoralEventResultsProgress).toBeDefined();
    expect(electoralEventResultsProgress.VDResultsIn).toBeGreaterThan(0);
    expect(electoralEventResultsProgress.VDTotal).toBeGreaterThan(0);
    expect(electoralEventResultsProgress.SeatCalculationCompleted).toBeDefined();
})

test('IEC.electoralEventProgressProvince', async () => {
    const electoralEventProgressProvince = await iec.electoralEventProgressProvince(electoralEvent, province);
    expect(electoralEventProgressProvince).toBeDefined();
    expect(electoralEventProgressProvince.VDResultsIn).toBeGreaterThan(0);
    expect(electoralEventProgressProvince.VDTotal).toBeGreaterThan(0);
    expect(electoralEventProgressProvince.SeatCalculationCompleted).toBeDefined();
})

test('IEC.electoralEventProgressMunicipality', async () => {
    const electoralEventProgressMunicipality = await iec.electoralEventProgressMunicipality(electoralEvent, municipality);
    expect(electoralEventProgressMunicipality).toBeDefined();
    expect(electoralEventProgressMunicipality.VDResultsIn).toBeGreaterThan(0);
    expect(electoralEventProgressMunicipality.VDTotal).toBeGreaterThan(0);
    expect(electoralEventProgressMunicipality.SeatCalculationCompleted).toBeDefined();
})

test('IEC.electoralEventProgressWard', async () => {
    const electoralEventProgressWard = await iec.electoralEventProgressWard(electoralEvent, municipality, ward);
    expect(electoralEventProgressWard).toBeDefined();
    expect(electoralEventProgressWard.VDResultsIn).toBeGreaterThan(0);
    expect(electoralEventProgressWard.VDTotal).toBeGreaterThan(0);
    expect(electoralEventProgressWard.SeatCalculationCompleted).toBeDefined();
})

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
    expect(NPEBallotResults.PartyBallotResults[0].ID).toBeDefined();
    expect(NPEBallotResults.PartyBallotResults[0].Name).toBeDefined();
    expect(NPEBallotResults.PartyBallotResults[0].ValidVotes).toBeGreaterThan(0);
    expect(NPEBallotResults.PartyBallotResults[0].PercOfVotes).toBeGreaterThan(0);
    expect(NPEBallotResults.PartyBallotResults[0].PartyAbbr).toBeDefined();
})

test('IEC.NPEBallotResultsProvince', async () => {
    const NPEBallotResultsProvince = await iec.NPEBallotResultsProvince(electoralEvent, province);
    expect(NPEBallotResultsProvince).toBeDefined();
    expect(NPEBallotResultsProvince.ElectoralEventID).toBeDefined();
    expect(NPEBallotResultsProvince.ElectoralEvent).toBeDefined();
    expect(NPEBallotResultsProvince.RegisteredVoters).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.SpoiltVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.Section24AVotes).toBeDefined();
    expect(NPEBallotResultsProvince.SpecialVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.PercVoterTurnout).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.TotalVotesCast).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.TotalValidVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.VDCount).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.VDWithResultsCaptured).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.bResultsComplete).toBeDefined();
    expect(NPEBallotResultsProvince.PartyBallotResults).toBeDefined();
    expect(NPEBallotResultsProvince.PartyBallotResults.length).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.PartyBallotResults[0].ID).toBeDefined();
    expect(NPEBallotResultsProvince.PartyBallotResults[0].Name).toBeDefined();
    expect(NPEBallotResultsProvince.PartyBallotResults[0].ValidVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.PartyBallotResults[0].PercOfVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsProvince.PartyBallotResults[0].PartyAbbr).toBeDefined();
})

test('IEC.NPEBallotResultsMunicipality', async () => {
    const NPEBallotResultsMunicipality = await iec.NPEBallotResultsMunicipality(electoralEvent, province, municipality);
    expect(NPEBallotResultsMunicipality).toBeDefined();
    expect(NPEBallotResultsMunicipality.ElectoralEventID).toBeDefined();
    expect(NPEBallotResultsMunicipality.ElectoralEvent).toBeDefined();
    expect(NPEBallotResultsMunicipality.RegisteredVoters).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.SpoiltVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.Section24AVotes).toBeDefined();
    expect(NPEBallotResultsMunicipality.SpecialVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.PercVoterTurnout).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.TotalVotesCast).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.TotalValidVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.VDCount).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.VDWithResultsCaptured).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.bResultsComplete).toBeDefined();
    expect(NPEBallotResultsMunicipality.PartyBallotResults).toBeDefined();
    expect(NPEBallotResultsMunicipality.PartyBallotResults.length).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.PartyBallotResults[0].ID).toBeDefined();
    expect(NPEBallotResultsMunicipality.PartyBallotResults[0].Name).toBeDefined();
    expect(NPEBallotResultsMunicipality.PartyBallotResults[0].ValidVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.PartyBallotResults[0].PercOfVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsMunicipality.PartyBallotResults[0].PartyAbbr).toBeDefined();
})

test('IEC.NPEBallotResultsVotingDistrict', async () => {
    const NPEBallotResultsVotingDistrict = await iec.NPEBallotResultsVotingDistrict(electoralEvent, province, municipality, vd);
    expect(NPEBallotResultsVotingDistrict).toBeDefined();
    expect(NPEBallotResultsVotingDistrict.ElectoralEventID).toBeDefined();
    expect(NPEBallotResultsVotingDistrict.ElectoralEvent).toBeDefined();
    expect(NPEBallotResultsVotingDistrict.RegisteredVoters).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.SpoiltVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.Section24AVotes).toBeDefined();
    expect(NPEBallotResultsVotingDistrict.SpecialVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.PercVoterTurnout).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.TotalVotesCast).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.TotalValidVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.VDCount).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.VDWithResultsCaptured).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.bResultsComplete).toBeDefined();
    expect(NPEBallotResultsVotingDistrict.PartyBallotResults).toBeDefined();
    expect(NPEBallotResultsVotingDistrict.PartyBallotResults.length).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.PartyBallotResults[0].ID).toBeDefined();
    expect(NPEBallotResultsVotingDistrict.PartyBallotResults[0].Name).toBeDefined();
    expect(NPEBallotResultsVotingDistrict.PartyBallotResults[0].ValidVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.PartyBallotResults[0].PercOfVotes).toBeGreaterThan(0);
    expect(NPEBallotResultsVotingDistrict.PartyBallotResults[0].PartyAbbr).toBeDefined();
})

test('IEC.NPESeatCalculationResults', async () => {
    const NPESeatCalculationResults = await iec.NPESeatCalculationResults(electoralEvent);
    expect(NPESeatCalculationResults).toBeDefined();
    expect(NPESeatCalculationResults.ElectoralEventID).toBe(electoralEvent);
    expect(NPESeatCalculationResults.ElectoralEvent).toBeDefined();
    expect(NPESeatCalculationResults.PartyResults).toBeDefined();
    expect(NPESeatCalculationResults.PartyResults.length).toBeGreaterThan(0);
    expect(NPESeatCalculationResults.PartyResults[0].ID).toBeDefined();
    expect(NPESeatCalculationResults.PartyResults[0].Name).toBeDefined();
    expect(NPESeatCalculationResults.PartyResults[0].Regional).toBeGreaterThan(0);
    expect(NPESeatCalculationResults.PartyResults[0].NationalPR).toBeGreaterThan(0);
    expect(NPESeatCalculationResults.PartyResults[0].Overall).toBeGreaterThan(0);
})

test('NPESeatAllocationResults', async () => {
    const NPESeatAllocationResults = await iec.NPESeatAllocationResults(electoralEvent, party);
    expect(NPESeatAllocationResults).toBeDefined();
    expect(NPESeatAllocationResults.length).toBeGreaterThan(0);
    expect(NPESeatAllocationResults[0].ID).toBeDefined();
    expect(NPESeatAllocationResults[0].Rank).toBeDefined();
    expect(NPESeatAllocationResults[0].Firstname).toBeDefined();
    expect(NPESeatAllocationResults[0].Surname).toBeDefined();
})

test('IEC.NPECandidates', async () => {
    const NPECandidates = await iec.NPECandidates(electoralEvent, party);
    expect(NPECandidates).toBeDefined();
    expect(NPECandidates.length).toBeGreaterThan(0);
    expect(NPECandidates[0].Rank).toBeDefined();
    expect(NPECandidates[0].ID).toBeDefined();
    expect(NPECandidates[0].Firstname).toBeDefined();
    expect(NPECandidates[0].Surname).toBeDefined();
    expect(NPECandidates[0].ListType).toBeDefined();
    expect(NPECandidates[0].ProvinceID).toBeDefined();
    expect(NPECandidates[0].Province).toBeDefined();
    expect(NPECandidates[0].PartyAbbr).toBeDefined();
})

test('IEC.delimitationsLatLong', async () => {
    const delimitationsLatLong = await iec.delimitationsLatLong(lat, lng);
    expect(delimitationsLatLong).toBeDefined();
    expect(delimitationsLatLong.ProvinceID).toBeDefined();
    expect(delimitationsLatLong.Province).toBeDefined();
    expect(delimitationsLatLong.MunicipalityID).toBeDefined();
    expect(delimitationsLatLong.Municipality).toBeDefined();
    expect(delimitationsLatLong.WardID).toBeDefined();
    expect(delimitationsLatLong.VDNumber).toBeDefined();
})