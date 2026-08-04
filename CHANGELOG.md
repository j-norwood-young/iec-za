# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-08-04

### Added

- `IEC_URL` environment variable override for the API base URL
- Named element types for seat and delimitation responses (`IECPartySeatResult`, `IECProvincePartySeatResult`, `IECNPECandidate`, `IECNPESeatAllocation`, and related delimitation item types)
- Correctly spelled `IECContestingPartiesResponse` type (misspelled `IECContenstingPartiesResponse` kept as a deprecated alias)

### Changed

- Delimitation, candidate, and seat result response types use proper arrays instead of single-element tuple shapes
- Login and API requests check HTTP status before parsing JSON and throw clearer errors
- dotenv loads quietly; ESLint flat config; Jest/TypeScript/eslint toolchain updated to current majors
