import axios from 'axios';

/** class with helper methods to centralize information for AJAX calls, can be called throughout app */
class JoblyApi {
    static async request(endpoint, paramsOrData = {}, verb = "get") {
        paramsOrData._token = ( // for now, hardcode token for "testuser"
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6" +
            "InRlc3R1c2VyIiwiaXNfYWRtaW4iOmZhbHNlLCJpYXQiOjE1NDE1N" +
            "jQ2Nzl9.LYDHSkl81gEm7jfHv9wJhzD4ndpuBkSzBan8Nirb6UY");

        console.debug("API Call:", endpoint, paramsOrData, verb);

        try {
            return (await axios({
                method: verb,
                url: `http://localhost:3001/${endpoint}`,
                [verb === "get" ? "params" : "data"]: paramsOrData
            })).data;
            // axios sends query string data via the "params" key,
            // and request body data via the "data" key,
            // so the key we need depends on the HTTP verb
        }

        catch (err) {
            console.error("API Error:", err.response);
            let message = err.response.data.message;
            throw Array.isArray(message) ? message : [message];
        }
    }

    /** Ajax call to get one company. => 
     * { company: { handle, name, num_employees, description, logo_url,
     *              jobs: [{ id, title, salary, equity }, ...]
     * }}
    */
    static async getCompany(handle) {
        let res = await this.request(`companies/${handle}`);
        return res.company;
    }

    /** Ajax call to get all companies. =>
     * { companies: [{ handle, name, description, logo_url }, ...} ]}
    */
    static async getAllCompanies(params) {
        let res = await this.request('companies/', params);
        return res.companies;
    }

    /** Ajax call to get all companies. =>
     * { jobs: [{ id, title, company_handle, salary, equity, state: null/applied }, ...} ]}
    */
    static async getAllJobs(params) {
        let res = await this.request('jobs/', params);
        return res.jobs;
    }
}

export default JoblyApi;