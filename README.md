# IEC ZA

A Typescript module to retrieve data from the Independent Electoral Commission of South Africa's API.

## Notes

- This module is not affiliated with the Independent Electoral Commission of South Africa. It is an unofficial module created to make it easier to retrieve data from the IEC's API. See [#IEC information](#iec-information) for more information.
- Supports **National/Provincial Elections (NPE)** and **Local Government Elections (LGE)** result surfaces (ballots, seats, candidates, councilors, progress, delimitation, parties, latest results, voting stations).
- Voter lookup, observer, and special-vote application endpoints are intentionally out of scope.
- It is mostly a pass-through to the IEC's API. Some smarter features may be added in the future.

## Installation

### NPM

```bash
npm install iec-za
```

### Local development (sibling repo)

From a consumer such as `electionengine`:

```bash
npm install ../iec-za
```

Rebuild after source changes:

```bash
cd ../iec-za && npm run build
```

### Environmental variables

Copy `dotenv` file to `.env` and fill in the required fields.

```bash
IEC_USERNAME="username"
IEC_PASSWORD="password"
IEC_URL="https://api.elections.org.za" # Optional
```

You can also set the environment variables directly.

```bash
export IEC_USERNAME="username"
export IEC_PASSWORD="password"
```

## IEC information

- You can get a username and password by emailing the IEC at [webmaster@elections.org.za](mailto:webmaster@elections.org.za)

- Please read and abide by the IEC's API [terms and conditions](https://api.elections.org.za/media/API_TERMS_OF_USE.htm)

- The documentation for the IEC API is available [here](https://api.elections.org.za/Help)

## Usage

```typescript
import { IEC } from 'iec-za';

const iec = new IEC(); // or new IEC({ username: 'username', password: 'password', url: 'https://api.elections.org.za', version: 'v1' });
async function main() {
    const electoralEventTypes = await iec.electoralEventTypes();
    const lgeType = electoralEventTypes.find((t) => /local\s+government/i.test(t.Description));
    const events = await iec.electoralEvents(lgeType!.ID);
    const event2021 = events.find((e) => e.Description.includes('2021'));
    const results = await iec.LGEBallotResults(event2021!.ID);
    console.log(results.PartyBallotResults[0]);
}
```

## Methods

For more information on the methods, please refer to the [IEC API documentation](https://api.elections.org.za/Help)

### Auth / low-level

#### `login(token?)`
- Logs in to the IEC API and returns a token.
- Pass an existing token to reuse it when still valid.
- When the access token is expired, tries `refresh_token` first, then falls back to password grant.
- Not strictly required — other methods log in automatically and refresh before expiry (60s skew).

#### `get(endpoint)`
- Low-level GET against `/api/{version}/{endpoint}`.
- Ensures a valid token before each request; on `401`/`403`, re-authenticates once and retries.
- Prefer the typed methods below.

### Electoral events & progress

#### `electoralEventTypes()`
- Returns electoral event types (National, Provincial, Local Government, …).

#### `electoralEvents(electionTypeId, parentEventId?)`
- Returns electoral events for a type; optional `ParentEventID` for by-elections.

#### `electoralEventResultsProgress(eventId)`
#### `electoralEventProgressProvince(eventId, provinceId)`
#### `electoralEventProgressMunicipality(eventId, provinceId, municipalityId)`
#### `electoralEventProgressWard(eventId, provinceId, municipalityId, wardId)`
- Counting progress (`VDResultsIn`, `VDTotal`, `SeatCalculationCompleted`).
- Municipality and ward progress **require** `ProvinceID` per the IEC contract.

### Delimitation & parties

#### `delimitations(eventId)` → provinces
#### `delimitationsProvince(eventId, provinceId)` → municipalities
#### `delimitationsMunicipality(eventId, provinceId, municipalityId)` → wards
#### `delimitationsWard(eventId, provinceId, municipalityId, wardId)` → voting districts
#### `delimitationsLatLong(lat, long)` → delimitation for a coordinate

#### `contestingParties(eventId, provinceId?, municipalityId?)`
- Contesting parties for an event, optionally filtered by province/municipality.

### NPE (National / Provincial)

#### `NPEBallotResults(eventId)`
#### `NPEBallotResultsProvince(eventId, provinceId)`
#### `NPEBallotResultsMunicipality(eventId, provinceId, municipalityId)`
#### `NPEBallotResultsVotingDistrict(eventId, provinceId, municipalityId, vdNumber)`
#### `NPESeatCalculationResults(eventId)`
#### `NPESeatCalculationResultsProvince(eventId, provinceId)`
#### `NPESeatAllocationResults(eventId, partyId)`
#### `NPECandidates(eventId, partyId)`
- National party-list candidates for an electoral event.
#### `NPECandidatesProvince(eventId, provinceId, partyId)`
- Provincial party-list candidates for an electoral event and province.

### LGE (Local Government)

#### `LGEBallotResults(eventId)`
#### `LGEBallotResultsProvince(eventId, provinceId)`
#### `LGEBallotResultsMunicipality(eventId, provinceId, municipalityId)`
#### `LGEBallotResultsWard(eventId, provinceId, municipalityId, wardId)`
#### `LGEBallotResultsVotingDistrict(eventId, provinceId, municipalityId, vdNumber)`
- Party ballots include `Ward_ValidVotes`, `PR_ValidVotes`, `DC40Perc_ValidVotes`, and `TotalValidVotes`.

#### `LGESeatCalculationResults(eventId, municipalityId)`
- Municipal council seat allocation (ward + PR seats per party).

#### `LGECandidatesByWard(eventId, wardId)`
#### `LGECandidatesByMunicipality(eventId, municipalityId)`
- Ward contestants vs PR list candidates (`ListOrderNo` on PR).

#### `LGEWardCouncilor(wardId)`
#### `LGEWardCouncilorByLatLong(lat, long)`
#### `LGECouncilorsByEvent(eventId)`

### Live feeds / stations

#### `LatestResultsIn(eventId, numberOfVDs)`
#### `VotingStationDetailsByVD(vdNumber)`
#### `VotingStationDetailsByLocation(lat, long)`
#### `VotingStationsByEvent(eventId)`

## Tests

```bash
npm run test:unit   # mocked URL / error-path tests (no credentials)
npm run test:live   # live IEC NPE + LGE (requires IEC_USERNAME / IEC_PASSWORD)
npm test            # unit + live
```

Live LGE tests discover the 2021 Local Government Election and traverse a real province → municipality → ward → VD before exercising ballot, seat, candidate, councilor, progress, party, and station endpoints.

## License
MIT License

Copyright (c) 2024 Jason Norwood-Young

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
