# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2026-08-31

### Fixed

- Access tokens are refreshed before expiry (60s skew) instead of being reused until process restart
- Expired sessions re-authenticate via `refresh_token`, falling back to password grant when refresh fails
- `401`/`403` responses trigger a single re-login and retry so long-running clients recover without a restart

## [0.3.0] - 2026-08-04

### Added

- Full Local Government Election (LGE) client coverage: `LGEBallotResults` (event → province → municipality → ward → VD), `LGESeatCalculationResults`, ward/PR `LGECandidates`, `LGEWardCouncilor`, `CouncilorsByEvent`
- Supporting live-feed helpers: `LatestResultsIn`, `VotingStationDetailsByVD`, `VotingStationDetailsByLocation`, `VotingStationsByEvent`
- Scoped `contestingParties` filters (province, municipality) and optional `ParentEventID` on `electoralEvents`
- Shared `buildQuery` / `buildEndpoint` helpers for typed query construction
- Unit tests for URL construction and LGE method endpoints; live LGE integration suite against the 2021 election
- Clearer errors for empty or non-JSON IEC response bodies

### Changed

- `electoralEventProgressMunicipality` and `electoralEventProgressWard` now require `ProvinceID` to match the IEC Help contract

## [0.2.0] - 2026-08-04

### Added

- `IEC_URL` environment variable override for the API base URL
- Named element types for seat and delimitation responses (`IECPartySeatResult`, `IECProvincePartySeatResult`, `IECNPECandidate`, `IECNPESeatAllocation`, and related delimitation item types)
- Correctly spelled `IECContestingPartiesResponse` type (misspelled `IECContenstingPartiesResponse` kept as a deprecated alias)

### Changed

- Delimitation, candidate, and seat result response types use proper arrays instead of single-element tuple shapes
- Login and API requests check HTTP status before parsing JSON and throw clearer errors
- dotenv loads quietly; ESLint flat config; Jest/TypeScript/eslint toolchain updated to current majors
