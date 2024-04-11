# IEC ZA

A Typescript module to retrieve data from the Independent Electoral Commission of South Africa's API.

## Notes

- This module is not affiliated with the Independent Electoral Commission of South Africa. It is an unofficial module created to make it easier to retrieve data from the IEC's API. See [#IEC information](#iec-information) for more information.
- This module is a work in progress. It is not yet feature complete. It is focussed on National and Provincial Elections (NPE) data at the moment. 
- It is mostly a pass-through to the IEC's API. Some smarter features may be added in the future.

## Installation

### NPM

```bash
npm install iec-za
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
    const electoralEventTypes = await iec.electoralEventTypes(); // Retrieves the electoral event types
    console.log(electoralEventTypes);
}
```

## Methods

For more information on the methods, please refer to the [IEC API documentation](https://api.elections.org.za/Help)

### `login(token?: string)`
- Logs in to the IEC API. 
- Returns a token.
- Send a token to reuse an existing token.
- Not strictly required as the other methods will log in automatically.

### `get(endpoing: string)`

- Low-level method to retrieve data from the IEC API.
- Typically you would use the other methods instead.

### `electoralEventTypes()`

- Retrieves the electoral event types.
- Returns an array of electoral event types.

### `electoralEvents(electionType)`

- Retrieves the electoral events.
- Returns an array of electoral events.

### `delimitations(electoralEventId)`

- Retrieves the delimitations.
- Returns an array of provinces.

### `delimitationsProvince(electoralEventId, provinceId)`

- Retrieves the delimitations for a province.
- Returns an array of municipalities.

### `delimitationsMunicipality(electoralEventId, municipalityId)`

- Retrieves the delimitations for a municipality.
- Returns an array of wards.

### `delimitationsWard(electoralEventId, wardId)`

- Retrieves the delimitations for a ward.
- Returns an array of voting districts.

### `delimitationsVotingDistrict(electoralEventId, votingDistrictId)`

- Retrieves the delimitations for a voting district.
- Returns an array of voting stations.

### `delimitationsLatLong(lat, long)`

- Retrieves the delimitations for a latitude and longitude.
- Returns province, municipality, ward, and voting district.

### `contestingParties(electoralEventId)`

- Retrieves the contesting parties.
- Returns an array of contesting parties.

### `electoralEventResultsProgress(electoralEventId)`

- Retrieves the electoral event results progress.
- Returns an array of electoral event results progress.

### `electoralEventProgressProvince(electoralEventId, provinceId)`

- Retrieves the electoral event progress for a province.
- Returns an array of electoral event progress for a province.

### `electoralEventProgressMunicipality(electoralEventId, municipalityId)`

- Retrieves the electoral event progress for a municipality.
- Returns an array of electoral event progress for a municipality.

### `electoralEventProgressWard(electoralEventId, wardId)`

- Retrieves the electoral event progress for a ward.
- Returns an array of electoral event progress for a ward.

### `NPEBallotResults(electoralEventId)`

- Retrieves the NPE ballot results.
- Returns an array of NPE ballot results (PartyBallotResults).

### `NPEBallotResultsProvince(electoralEventId, provinceId)`

- Retrieves the NPE ballot results for a province.
- Returns an array of NPE ballot results for a province.

### `NPEBallotResultsMunicipality(electoralEventId, municipalityId)`

- Retrieves the NPE ballot results for a municipality.
- Returns an array of NPE ballot results for a municipality.

### `NPEBallotResultsVotingDistrict(electoralEventId, municipalityId, wardId, votingDistrictId)`

- Retrieves the NPE ballot results for a voting district.
- Returns an array of NPE ballot results for a voting district.

### `NPESeatCalculationResults(electoralEventId)`

- Retrieves the NPE seat calculation results.
- Returns an array of NPE seat calculation results by party (PartyResults).

### `NPESeatCalculationResultsProvince(electoralEventId, provinceId)`

- Retrieves the NPE seat calculation results for a province.
- Returns an array of NPE seat calculation results for provincial legislature.

### `NPESeatAllocationResults(electoralEventId, partyId)`

- Retrieves the NPE seat allocation results for a party.
- Returns an array of NPE seat allocation results for a party.

### `NPECandidates(electoralEventId, partyId)`

- Retrieves the NPE candidates for a party.
- Returns an array of NPE candidates for a party.

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
