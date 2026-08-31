import dotenv from "dotenv";
dotenv.config({ quiet: true });

export type IECResponse = {
    Message?: string;
}

export type IECTokenResponse = {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    userName: string;
    ".issued": string;
    ".expires": string;
    error?: string;
}

export type IECElectoralEventTypeResponse = {
    ID: number;
    Description: string;
}

export type IECElectoralEventResponse = {
    ID: number;
    Description: string;
    IsActive: boolean;
}

export type IECResultsProgressResponse = {
    VDResultsIn: number;
    VDTotal: number;
    SeatCalculationCompleted: boolean;
}

export type IECPartyBallotResultsResponse = {
    ID: number;
    Name: string;
    ValidVotes: number;
    PercOfVotes: number;
    PartyAbbr: string;
}

export type IECNPEBallotResultsResponse = {
    ElectoralEventID: number;
    ElectoralEvent: string;
    RegisteredVoters: number;
    SpoiltVotes: number;
    Section24AVotes: number;
    SpecialVotes: number;
    PercVoterTurnout: number;
    TotalVotesCast: number;
    TotalValidVotes: number;
    VDCount: number;
    VDWithResultsCaptured: number;
    bResultsComplete: boolean;
    PartyBallotResults: IECPartyBallotResultsResponse[];
}

export type IECNPEBallotResultsProvinceResponse = IECNPEBallotResultsResponse & {
    ProvinceID: number;
    Province: string;
}

export type IECNPEBallotResultsMunicipalityResponse = IECNPEBallotResultsProvinceResponse & {
    MunicipalityID: number;
    Municipality: string;
}

export type IECNPEBallotResultsVotingDistrictResponse = IECNPEBallotResultsMunicipalityResponse & {
    VDNumber: number;
}

export type IECContestingPartiesResponse = {
    ID: number;
    Name: string;
    LogoUrl: string;
    Abbreviation: string;
}

/** @deprecated Use IECContestingPartiesResponse */
export type IECContenstingPartiesResponse = IECContestingPartiesResponse;

export type IECDelimitationProvince = {
    ProvinceID: number;
    Province: string;
}

export type IECDelimitationResponse = IECDelimitationProvince[];

export type IECDelimitationMunicipality = {
    ProvinceID: number;
    MunicipalityID: number;
    Municipality: string;
    MunicTypeID: number;
}

export type IECDelimitationProvinceResponse = IECDelimitationMunicipality[];

export type IECDelimitationWard = {
    ProvinceID: number;
    MunicipalityID: number;
    WardID: number;
}

export type IECDelimitationMunicipalityResponse = IECDelimitationWard[];

export type IECDelimitationVotingDistrict = IECDelimitationWard & {
    VDNumber: number;
}

export type IECDelimitationWardResponse = IECDelimitationVotingDistrict[];

export type IECDelimitationLatLongResponse = {
    ProvinceID: number;
    Province: string;
    MunicipalityID: number;
    Municipality: string;
    WardID: number;
    VDNumber: number;
}

export type IECPartySeatResult = {
    ID: number;
    Name: string;
    Regional: number;
    NationalPR: number;
    Overall: number;
}

export type IECNPESeatCalculationResultsResponse = {
    ElectoralEventID: number;
    ElectoralEvent: string;
    PartyResults: IECPartySeatResult[];
}

export type IECProvincePartySeatResult = {
    ID: number;
    Name: string;
    NumberOfSeats: number;
}

export type IECNPESeatCalculationResultsProvinceResponse = {
    ElectoralEventID: number;
    ElectoralEvent: string;
    ProvinceID: number;
    Province: string;
    PartyResults: IECProvincePartySeatResult[];
}

export type IECNPECandidate = {
    Rank: number;
    ID: number;
    Firstname: string;
    Surname: string;
    ListType: string;
    ProvinceID: number;
    Province: string;
    PartyAbbr: string;
}

export type IECNPECandidatesResponse = IECNPECandidate[];

export type IECNPESeatAllocation = {
    Rank: number;
    ID: number;
    Firstname: string;
    Surname: string;
}

export type IECNPESeatAllocationResultsResponse = IECNPESeatAllocation[];

/** LGE party ballot line — Ward + PR + DC40 breakdown. */
export type IECLGEPartyBallotResult = {
    ID: number;
    Name: string;
    Ward_ValidVotes: number;
    PR_ValidVotes: number;
    DC40Perc_ValidVotes: number;
    TotalValidVotes: number;
    PercOfVotes: number;
    IsOnNational: boolean;
    Color: string;
}

export type IECLGEBallotResultsResponse = {
    ElectoralEventID: number;
    ElectoralEvent: string;
    RegisteredVoters: number;
    SpoiltVotes: number;
    SpecialVotes: number;
    PercVoterTurnout: number;
    TotalVotesCast: number;
    TotalValidVotes: number;
    VDCount: number;
    VDWithResultsCaptured: number;
    bResultsComplete: boolean;
    ReportDate?: string;
    PartyBallotResults: IECLGEPartyBallotResult[];
}

export type IECLGEBallotResultsProvinceResponse = IECLGEBallotResultsResponse & {
    ProvinceID: number;
    Province: string;
}

export type IECLGEBallotResultsMunicipalityResponse = IECLGEBallotResultsProvinceResponse & {
    MunicipalityID: number;
    Municipality: string;
}

export type IECLGEBallotResultsWardResponse = IECLGEBallotResultsMunicipalityResponse & {
    WardID: number;
}

export type IECLGEBallotResultsVotingDistrictResponse = IECLGEBallotResultsMunicipalityResponse & {
    WardID?: number;
    VDNumber: number;
}

export type IECLGESeatPartyResult = {
    ID: number;
    Name: string;
    TotalValidVotes: number;
    TotalPartySeats: number;
    WardSeats: number;
    PRSeats: number;
}

export type IECLGESeatCalculationResultsResponse = {
    ElectoralEventID: number;
    ElectoralEvent: string;
    ProvinceID: number;
    Province: string;
    MunicipalityID: number;
    Municipality: string;
    Quota: number;
    TotalSeatsAvailable: number;
    IndependentSeatsWon: number;
    WardCouncillorsWithNoPR: number;
    TotalValidVotes: number;
    ReportDate?: string;
    PartyResults: IECLGESeatPartyResult[];
}

export type IECLGEWardCandidate = {
    CandidateID: number;
    PartyID: number;
    PartyName: string;
    Surname: string;
    Fullname: string;
}

export type IECLGEPRCandidate = {
    CandidateID: number;
    ListOrderNo: number;
    PartyID: number;
    PartyName: string;
    Surname: string;
    Fullname: string;
}

export type IECContactDetails = {
    ContactPerson: string;
    Tel: string;
    Fax: string;
    PostalAddress: string;
    WebsiteUrl: string;
}

export type IECPartyDetail = {
    ID: number;
    Name: string;
    Abbreviation: string;
    LogoUrl: string;
    RegStatus: string;
    RegLevel: string;
    ContactDetails?: IECContactDetails;
}

export type IECMunicipalityDetail = {
    ID: number;
    Name: string;
    ContactDetails?: IECContactDetails;
}

export type IECWardCouncilorDelimitation = {
    ProvinceID: number;
    Province: string;
    MunicipalityID: number;
    Municipality: string;
    WardID: number;
    VDNumber: number;
}

export type IECLGEWardCouncilorResponse = {
    Name: string;
    Delimitation?: IECWardCouncilorDelimitation;
    PartyDetail?: IECPartyDetail;
    Municipality?: IECMunicipalityDetail;
    ProvinceID: number;
    Province: string;
    MunicipalityID: number;
    WardID: number;
    PartyID: number;
    PartyName: string;
    PartyAbbreviation: string;
}

export type IECLGECouncilorByEvent = {
    Name: string;
    ProvinceID: number;
    Province: string;
    MunicipalityID: number;
    WardID: number;
    PartyID: number;
    PartyName: string;
    PartyAbbreviation: string;
}

export type IECLatestResultsInItem = {
    ProvinceID?: number;
    Province?: string;
    MunicipalityID?: number;
    Municipality?: string;
    WardID?: number;
    VDNumber?: number;
    [key: string]: unknown;
}

export type IECVotingStationDetails = {
    Name?: string;
    Location?: {
        Latitude?: number;
        Longitude?: number;
        Municipality?: string;
        MunicipalityID?: number;
        Province?: string;
        ProvinceID?: number;
        Street?: string;
        Suburb?: string;
        Town?: string;
        VDAddress?: string;
        VDNumber?: number;
        VotingDistrict?: string;
        WardID?: number;
    };
    Delimitation?: IECWardCouncilorDelimitation;
    [key: string]: unknown;
}

export type IECQueryParams = Record<string, string | number | boolean | undefined | null>;

/**
 * Build a query string from defined params (skips undefined/null).
 * Values are URL-encoded.
 */
export function buildQuery(params: IECQueryParams): string {
    const parts: string[] = [];
    for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null) continue;
        parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
    }
    return parts.join("&");
}

/**
 * Build an endpoint path with an optional query string.
 */
export function buildEndpoint(path: string, params?: IECQueryParams): string {
    if (!params) return path;
    const q = buildQuery(params);
    return q ? `${path}?${q}` : path;
}

/** Refresh slightly before the token's stated expiry to avoid race with the server clock. */
const TOKEN_EXPIRY_SKEW_MS = 60_000;

export class IEC {
    url: string;
    username: string;
    password: string;
    _token: IECTokenResponse | undefined;
    _loggedIn: boolean = false;
    /** Coalesces concurrent login/refresh attempts. */
    _loginInFlight: Promise<IECTokenResponse> | null = null;
    version: string;

    constructor({ username, password, url, version}: { username?: string, password?: string, url?: string, version?: string } = {}) {
        this.url = url || process.env.IEC_URL || "https://api.elections.org.za";
        this.version = version || "v1";
        if (!username && process.env.IEC_USERNAME) {
            username = process.env.IEC_USERNAME;
        }
        if (!password && process.env.IEC_PASSWORD) {
            password = process.env.IEC_PASSWORD;
        }
        if (!username || !password) {
            throw new Error("Please set IEC_USERNAME and IEC_PASSWORD in .env file, or pass them as parameters to the constructor.");
        }
        this.username = username;
        this.password = password;
    }

    isTokenValid(token: IECTokenResponse | undefined = this._token): boolean {
        if (!token?.access_token || !token[".expires"]) {
            return false;
        }
        const expiresAt = Date.parse(token[".expires"]);
        if (Number.isNaN(expiresAt)) {
            return false;
        }
        return expiresAt - TOKEN_EXPIRY_SKEW_MS > Date.now();
    }

    clearAuth() {
        this._token = undefined;
        this._loggedIn = false;
    }

    private async fetchToken(body: Record<string, string>): Promise<IECTokenResponse> {
        const response = await fetch(`${this.url}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(body)
        });
        if (!response.ok) {
            throw new Error(`Login failed: ${response.status} ${response.statusText}`);
        }
        const token = await response.json() as IECTokenResponse;
        if (token.error) {
            throw new Error(token.error);
        }
        if (!token.access_token) {
            throw new Error("Login failed: missing access_token");
        }
        this._token = token;
        this._loggedIn = true;
        return this._token;
    }

    private async loginWithPassword(): Promise<IECTokenResponse> {
        return this.fetchToken({
            grant_type: 'password',
            username: this.username,
            password: this.password,
        });
    }

    private async loginWithRefresh(refreshToken: string): Promise<IECTokenResponse> {
        return this.fetchToken({
            grant_type: 'refresh_token',
            refresh_token: refreshToken,
        });
    }

    /**
     * Obtain (or reuse) an access token.
     * Pass an existing token to adopt it when still valid.
     * Otherwise refreshes when possible, then falls back to password grant.
     */
    async login(token?: IECTokenResponse) {
        if (token) {
            if (this.isTokenValid(token)) {
                this._token = token;
                this._loggedIn = true;
                return this._token;
            }
            // Adopt refresh_token from a caller-supplied expired token when present.
            if (token.refresh_token && !this._token?.refresh_token) {
                this._token = token;
            }
        }

        if (this.isTokenValid()) {
            return this._token!;
        }

        if (this._loginInFlight) {
            return this._loginInFlight;
        }

        this._loginInFlight = this.acquireToken().finally(() => {
            this._loginInFlight = null;
        });
        return this._loginInFlight;
    }

    private async acquireToken(): Promise<IECTokenResponse> {
        const refreshToken = this._token?.refresh_token;
        if (refreshToken) {
            try {
                return await this.loginWithRefresh(refreshToken);
            } catch {
                // Refresh may be revoked or expired; fall through to password grant.
            }
        }
        return this.loginWithPassword();
    }

    async ensureLoggedIn() {
        if (this.isTokenValid()) {
            return;
        }
        this._loggedIn = false;
        await this.login();
        if (!this.isTokenValid()) {
            throw new Error("Not logged in");
        }
    }

    async get(endpoint: string, { retryOnAuthFailure = true }: { retryOnAuthFailure?: boolean } = {}): Promise<IECResponse> {
        await this.ensureLoggedIn();
        if (!this._token?.access_token) {
            throw new Error("Not logged in");
        }
        const url = `${this.url}/api/${this.version}/${endpoint}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this._token.access_token}`
            }
        });
        if (response.status === 401 || response.status === 403) {
            if (retryOnAuthFailure) {
                const refreshToken = this._token?.refresh_token;
                this.clearAuth();
                // Keep refresh_token so login() can try refresh before password.
                if (refreshToken) {
                    this._token = {
                        access_token: '',
                        token_type: 'bearer',
                        expires_in: 0,
                        refresh_token: refreshToken,
                        userName: this.username,
                        '.issued': '',
                        '.expires': new Date(0).toISOString(),
                    };
                }
                await this.login();
                return this.get(endpoint, { retryOnAuthFailure: false });
            }
            throw new Error(`Request failed: ${response.status} ${response.statusText} (${endpoint})`);
        }
        if (!response.ok) {
            throw new Error(`Request failed: ${response.status} ${response.statusText} (${endpoint})`);
        }
        const text = await response.text();
        if (!text || !text.trim()) {
            throw new Error(`Empty response body (${endpoint})`);
        }
        let result: IECResponse;
        try {
            result = JSON.parse(text) as IECResponse;
        } catch {
            throw new Error(`Invalid JSON response (${endpoint})`);
        }
        if (result.Message) {
            throw new Error(result.Message);
        }
        return result;
    }

    async electoralEventTypes() {
        return this.get('ElectoralEvent') as Promise<IECElectoralEventTypeResponse[]>;
    }

    async electoralEvents(ElectoralEventTypeID: number, ParentEventID?: number) {
        return this.get(buildEndpoint('ElectoralEvent', {
            ElectoralEventTypeID,
            ParentEventID,
        })) as Promise<IECElectoralEventResponse[]>;
    }

    async electoralEventResultsProgress(ElectoralEventID: number) {
        return this.get(buildEndpoint('ResultsProgress', { ElectoralEventID })) as Promise<IECResultsProgressResponse>;
    }

    async electoralEventProgressProvince(ElectoralEventID: number, ProvinceID: number) {
        return this.get(buildEndpoint('ResultsProgress', {
            ElectoralEventID,
            ProvinceID,
        })) as Promise<IECResultsProgressResponse>;
    }

    /**
     * Municipality progress requires ProvinceID per IEC Help contract.
     */
    async electoralEventProgressMunicipality(
        ElectoralEventID: number,
        ProvinceID: number,
        MunicipalityID: number
    ) {
        return this.get(buildEndpoint('ResultsProgress', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
        })) as Promise<IECResultsProgressResponse>;
    }

    /**
     * Ward progress requires ProvinceID + MunicipalityID + WardID.
     */
    async electoralEventProgressWard(
        ElectoralEventID: number,
        ProvinceID: number,
        MunicipalityID: number,
        WardID: number
    ) {
        return this.get(buildEndpoint('ResultsProgress', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
            WardID,
        })) as Promise<IECResultsProgressResponse>;
    }

    async NPEBallotResults(ElectoralEventID: number) {
        return this.get(buildEndpoint('NPEBallotResults', { ElectoralEventID })) as Promise<IECNPEBallotResultsResponse>;
    }

    async NPEBallotResultsProvince(ElectoralEventID: number, ProvinceID: number) {
        return this.get(buildEndpoint('NPEBallotResults', {
            ElectoralEventID,
            ProvinceID,
        })) as Promise<IECNPEBallotResultsProvinceResponse>;
    }

    async NPEBallotResultsMunicipality(ElectoralEventID: number, ProvinceID: number, MunicipalityID: number) {
        return this.get(buildEndpoint('NPEBallotResults', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
        })) as Promise<IECNPEBallotResultsMunicipalityResponse>;
    }

    async NPEBallotResultsVotingDistrict(ElectoralEventID: number, ProvinceID: number, MunicipalityID: number, VDNumber: number) {
        return this.get(buildEndpoint('NPEBallotResults', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
            VDNumber,
        })) as Promise<IECNPEBallotResultsVotingDistrictResponse>;
    }

    async NPESeatCalculationResults(ElectoralEventID: number) {
        return this.get(buildEndpoint('NPESeatCalculationResults', { ElectoralEventID })) as Promise<IECNPESeatCalculationResultsResponse>;
    }

    async NPESeatCalculationResultsProvince(ElectoralEventID: number, ProvinceID: number) {
        return this.get(buildEndpoint('NPESeatCalculationResults', {
            ElectoralEventID,
            ProvinceID,
        })) as Promise<IECNPESeatCalculationResultsProvinceResponse>;
    }

    async NPESeatAllocationResults(ElectoralEventID: number, PartyID: number) {
        return this.get(buildEndpoint('NPESeatAllocationResults', {
            ElectoralEventID,
            PartyID,
        })) as Promise<IECNPESeatAllocationResultsResponse>;
    }

    async NPECandidates(ElectoralEventID: number, PartyID: number) {
        return this.get(buildEndpoint('NPECandidates', {
            ElectoralEventID,
            PartyID,
        })) as Promise<IECNPECandidatesResponse>;
    }

    async contestingParties(
        ElectoralEventID: number,
        ProvinceID?: number,
        MunicipalityID?: number
    ) {
        return this.get(buildEndpoint('ContestingParties', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
        })) as Promise<IECContestingPartiesResponse[]>;
    }

    async delimitations(ElectoralEventID: number) {
        return this.get(buildEndpoint('Delimitation', { ElectoralEventID })) as Promise<IECDelimitationResponse>;
    }

    async delimitationsProvince(ElectoralEventID: number, ProvinceID: number) {
        return this.get(buildEndpoint('Delimitation', {
            ElectoralEventID,
            ProvinceID,
        })) as Promise<IECDelimitationProvinceResponse>;
    }

    async delimitationsMunicipality(ElectoralEventID: number, ProvinceID: number, MunicipalityID: number) {
        return this.get(buildEndpoint('Delimitation', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
        })) as Promise<IECDelimitationMunicipalityResponse>;
    }

    async delimitationsWard(ElectoralEventID: number, ProvinceID: number, MunicipalityID: number, WardID: number) {
        return this.get(buildEndpoint('Delimitation', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
            WardID,
        })) as Promise<IECDelimitationWardResponse>;
    }

    async delimitationsLatLong(Latitude: number, Longitude: number) {
        return this.get(buildEndpoint('Delimitation', {
            Latitude,
            Longitude,
        })) as Promise<IECDelimitationLatLongResponse>;
    }

    // --- LGE Ballot Results ---

    async LGEBallotResults(ElectoralEventID: number) {
        return this.get(buildEndpoint('LGEBallotResults', { ElectoralEventID })) as Promise<IECLGEBallotResultsResponse>;
    }

    async LGEBallotResultsProvince(ElectoralEventID: number, ProvinceID: number) {
        return this.get(buildEndpoint('LGEBallotResults', {
            ElectoralEventID,
            ProvinceID,
        })) as Promise<IECLGEBallotResultsProvinceResponse>;
    }

    async LGEBallotResultsMunicipality(
        ElectoralEventID: number,
        ProvinceID: number,
        MunicipalityID: number
    ) {
        return this.get(buildEndpoint('LGEBallotResults', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
        })) as Promise<IECLGEBallotResultsMunicipalityResponse>;
    }

    async LGEBallotResultsWard(
        ElectoralEventID: number,
        ProvinceID: number,
        MunicipalityID: number,
        WardID: number
    ) {
        return this.get(buildEndpoint('LGEBallotResults', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
            WardID,
        })) as Promise<IECLGEBallotResultsWardResponse>;
    }

    async LGEBallotResultsVotingDistrict(
        ElectoralEventID: number,
        ProvinceID: number,
        MunicipalityID: number,
        VDNumber: number
    ) {
        return this.get(buildEndpoint('LGEBallotResults', {
            ElectoralEventID,
            ProvinceID,
            MunicipalityID,
            VDNumber,
        })) as Promise<IECLGEBallotResultsVotingDistrictResponse>;
    }

    // --- LGE Seat Calculation ---

    async LGESeatCalculationResults(ElectoralEventID: number, MunicipalityID: number) {
        return this.get(buildEndpoint('LGESeatCalculationResults', {
            ElectoralEventID,
            MunicipalityID,
        })) as Promise<IECLGESeatCalculationResultsResponse>;
    }

    // --- LGE Candidates ---

    async LGECandidatesByWard(ElectoralEventID: number, WardID: number) {
        return this.get(buildEndpoint('LGECandidates', {
            ElectoralEventID,
            WardID,
        })) as Promise<IECLGEWardCandidate[]>;
    }

    async LGECandidatesByMunicipality(ElectoralEventID: number, MunicipalityID: number) {
        return this.get(buildEndpoint('LGECandidates', {
            ElectoralEventID,
            MunicipalityID,
        })) as Promise<IECLGEPRCandidate[]>;
    }

    // --- LGE Ward Councilors ---

    async LGEWardCouncilor(WardID: number) {
        return this.get(buildEndpoint('LGEWardCouncilor', { WardID })) as Promise<IECLGEWardCouncilorResponse>;
    }

    async LGEWardCouncilorByLatLong(Latitude: number, Longitude: number) {
        return this.get(buildEndpoint('LGEWardCouncilor', {
            Latitude,
            Longitude,
        })) as Promise<IECLGEWardCouncilorResponse>;
    }

    async LGECouncilorsByEvent(ElectoralEventID: number) {
        return this.get(buildEndpoint('CouncilorsByEvent', {
            ElectoralEventID,
        })) as Promise<IECLGECouncilorByEvent[] | IECLGECouncilorByEvent>;
    }

    // --- Latest results / voting stations ---

    async LatestResultsIn(ElectoralEventID: number, NumberOfVDs: number) {
        return this.get(buildEndpoint('LatestResultsIn', {
            ElectoralEventID,
            NumberOfVDs,
        })) as Promise<IECLatestResultsInItem[]>;
    }

    async VotingStationDetailsByVD(VDNumber: number) {
        return this.get(buildEndpoint('VotingStationDetails', {
            VDNumber,
        })) as Promise<IECVotingStationDetails>;
    }

    async VotingStationDetailsByLocation(Latitude: number, Longitude: number) {
        return this.get(buildEndpoint('VotingStationDetails', {
            Latitude,
            Longitude,
        })) as Promise<IECVotingStationDetails>;
    }

    async VotingStationsByEvent(ElectoralEventID: number) {
        return this.get(buildEndpoint('VotingStations', {
            ElectoralEventID,
        })) as Promise<IECVotingStationDetails[]>;
    }
}
