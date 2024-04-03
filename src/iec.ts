import dotenv from "dotenv";
dotenv.config();

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

export type IECContenstingPartiesResponse = {
    ID: number;
    Name: string;
    LogoUrl: string;
    Abbreviation: string;
}

export type IECDelimitationResponse = [{
    ProvinceID: number;
    Province: string;
}]

export type IECDelimitationProvinceResponse = [{
    ProvinceID: number;
    MunicipalityID: number;
    Municipality: string;
    MunicTypeID: number;
}]

export type IECDelimitationMunicipalityResponse = [{
    ProvinceID: number;
    MunicipalityID: number;
    WardID: number;
}]

export type IECDelimitationWardResponse = IECDelimitationMunicipalityResponse & [{
    VDNumber: number;
}]

export type IECDelimitationLatLongResponse = {
    ProvinceID: number;
    Province: string;
    MunicipalityID: number;
    Municipality: string;
    WardID: number;
    VDNumber: number;
}

export type IECNPESeatCalculationResultsResponse = {
    ElectoralEventID: number;
    ElectoralEvent: string;
    PartyResults: [{
        ID: number;
        Name: string;
        Regional: number;
        NationalPR: number;
        Overall: number;
    }]
}

export type IECNPECandidatesResponse = [{
    Rank: number;
    ID: number;
    Firstname: string;
    Surname: string;
    ListType: string;
    ProvinceID: number;
    Province: string;
    PartyAbbr: string;
}]

export type IECNPESeatAllocationResultsResponse = [{
    Rank: number;
    ID: number;
    Firstname: string;
    Surname: string;
}]
    
export class IEC {
    url: string;
    username: string;
    password: string;
    _token: IECTokenResponse | undefined;
    _loggedIn: boolean = false;
    version: string;

    constructor({ username, password, url, version}: { username?: string, password?: string, url?: string, version?: string } = {}) {
        this.url = url || "https://api.elections.org.za";
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
    
    async login(token?: IECTokenResponse) {
        if (token) {
            const expires = new Date(token[".expires"]);
            if (expires > new Date()) {
                this._token = token;
                this._loggedIn = true;
                return this._token;
            }
        }
        this._token = await fetch(`${this.url}/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({ 
                grant_type: 'password',
                username: this.username, 
                password: this.password 
            })
        })
        .then(response => response.json() as Promise<IECTokenResponse>)
        .catch(error => {
            throw error;
        });
        // console.log(this._token);
        if (this._token.error) {
            throw new Error(this._token.error);
        }
        this._loggedIn = true;
        return this._token;
    }

    async get(endpoint: string) {
        if (!this._loggedIn) {
            await this.login();
        }
        if (!this._token || !this._token['access_token']) {
            throw new Error("Not logged in");
        }
        const url = `${this.url}/api/${this.version}/${endpoint}`;
        console.log(url);
        const result = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${this._token['access_token']}`
            }
        })
        .then(response => response.json() as IECResponse)
        .catch(error => {
            throw error;
        });
        if (result.Message) {
            throw new Error(result.Message);
        }
        return result;
    }

    async electoralEventTypes() {
        return this.get('ElectoralEvent') as Promise<IECElectoralEventTypeResponse[]>;
    }

    async electoralEvents(ElectoralEventTypeID: number) {
        return this.get(`ElectoralEvent?ElectoralEventTypeID=${ElectoralEventTypeID}`) as Promise<IECElectoralEventResponse[]>;
    }

    async electoralEventResultsProgress(ElectoralEventID: number) {
        return this.get(`ResultsProgress?ElectoralEventID=${ElectoralEventID}`) as Promise<IECResultsProgressResponse>;
    }

    async electoralEventProgressProvince(ElectoralEventID: number, ProvinceID: number) {
        return this.get(`ResultsProgress?ElectoralEventID=${ElectoralEventID}&ProvinceID=${ProvinceID}`) as Promise<IECResultsProgressResponse>;
    }

    async electoralEventProgressMunicipality(ElectoralEventID: number, MunicipalityID: number) {
        return this.get(`ResultsProgress?ElectoralEventID=${ElectoralEventID}&MunicipalityID=${MunicipalityID}`) as Promise<IECResultsProgressResponse>;
    }

    async electoralEventProgressWard(ElectoralEventID: number, MunicipalityID: number, WardID: number) {
        return this.get(`ResultsProgress?ElectoralEventID=${ElectoralEventID}&MunicipalityID=${MunicipalityID}&WardID=${WardID}`) as Promise<IECResultsProgressResponse>;
    }

    async NPEBallotResults(ElectoralEventID: number) {
        return this.get(`NPEBallotResults?ElectoralEventID=${ElectoralEventID}`) as Promise<IECNPEBallotResultsResponse>;
    }

    async NPEBallotResultsProvince(ElectoralEventID: number, ProvinceID: number) {
        return this.get(`NPEBallotResults?ElectoralEventID=${ElectoralEventID}&ProvinceID=${ProvinceID}`) as Promise<IECNPEBallotResultsProvinceResponse>;
    }

    async NPEBallotResultsMunicipality(ElectoralEventID: number, ProvinceID: number, MunicipalityID: number) {
        return this.get(`NPEBallotResults?ElectoralEventID=${ElectoralEventID}&ProvinceID=${ProvinceID}&MunicipalityID=${MunicipalityID}`) as Promise<IECNPEBallotResultsMunicipalityResponse>;
    }

    async NPEBallotResultsVotingDistrict(ElectoralEventID: number, ProvinceID: number, MunicipalityID: number, VDNumber: number) {
        return this.get(`NPEBallotResults?ElectoralEventID=${ElectoralEventID}&ProvinceID=${ProvinceID}&MunicipalityID=${MunicipalityID}&VDNumber=${VDNumber}`) as Promise<IECNPEBallotResultsVotingDistrictResponse>;
    }

    async NPESeatCalculationResults(ElectoralEventID: number) {
        return this.get(`NPESeatCalculationResults?ElectoralEventID=${ElectoralEventID}`) as Promise<IECNPESeatCalculationResultsResponse>;
    }

    async NPESeatAllocationResults(ElectoralEventID: number, PartyID: number) {
        return this.get(`NPESeatAllocationResults?ElectoralEventID=${ElectoralEventID}&PartyID=${PartyID}`) as Promise<IECNPESeatAllocationResultsResponse>;
    }

    async NPECandidates(ElectoralEventID: number, PartyID: number) {
        return this.get(`NPECandidates?ElectoralEventID=${ElectoralEventID}&PartyID=${PartyID}`) as Promise<IECNPECandidatesResponse>;
    }

    async contestingParties(ElectoralEventID: number) {
        return this.get(`ContestingParties?ElectoralEventID=${ElectoralEventID}`) as Promise<IECContenstingPartiesResponse[]>;
    }

    async delimitations(ElectoralEventID: number) {
        return this.get(`Delimitation?ElectoralEventID=${ElectoralEventID}`) as Promise<IECDelimitationResponse>;
    }

    async delimitationsProvince(ElectoralEventID: number, ProvinceID: number) {
        return this.get(`Delimitation?ElectoralEventID=${ElectoralEventID}&ProvinceID=${ProvinceID}`) as Promise<IECDelimitationProvinceResponse>;
    }

    async delimitationsMunicipality(ElectoralEventID: number, ProvinceID: number, MunicipalityID: number) {
        return this.get(`Delimitation?ElectoralEventID=${ElectoralEventID}&ProvinceID=${ProvinceID}&MunicipalityID=${MunicipalityID}`) as Promise<IECDelimitationMunicipalityResponse>;
    }

    async delimitationsWard(ElectoralEventID: number, ProvinceID: number, MunicipalityID: number, WardID: number) {
        return this.get(`Delimitation?ElectoralEventID=${ElectoralEventID}&ProvinceID=${ProvinceID}&MunicipalityID=${MunicipalityID}&WardID=${WardID}`) as Promise<IECDelimitationWardResponse>;
    }

    async delimitationsLatLong(Latitude: number, Longitude: number) {
        return this.get(`Delimitation?Latitude=${Latitude}&Longitude=${Longitude}`) as Promise<IECDelimitationLatLongResponse>;
    }

}