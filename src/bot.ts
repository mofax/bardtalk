import got from 'got';

function redId(): number {
    return Math.floor(Math.random() * (99999 - 12345) + 12345)
}

class Bard {
    private headers: any;
    private SNlM0e: string | null = null;
    public conversation_id: string;
    public response_id: string;
    public choice_id: string;
    public reqid = redId();

    constructor(sessionID: string, SNlM0e?: string) {
        this.headers = {
            "Host": "bard.google.com",
            "X-Same-Domain": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
            // "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
            "Origin": "https://bard.google.com",
            "Referer": "https://bard.google.com/",
            'Cookie': `__Secure-1PSID=${sessionID}`
        };
        this.conversation_id = "";
        this.response_id = "";
        this.choice_id = "";
        this.SNlM0e = SNlM0e || null;
    }

    private async get_snlm0e(): Promise<string> {
        const fromNet = async () => {
            const resp = await got.get("https://bard.google.com/", { headers: this.headers });

            const regexResult = null // /SNlM0e\":\"(.*?)\"/.exec(resp.body);
            const SNlM0e = /SNlM0e:\"(.*?)\"/.exec(resp.body)

            if (!regexResult) {
                throw new Error("Could not extract SNlM0e");
            }
            return regexResult[1];
        }

        try {
            if (this.SNlM0e) return this.SNlM0e
            this.SNlM0e = await fromNet();
            return this.SNlM0e;
        } catch (error) {
            throw new Error("Could not get Google Bard");
        }
    }

    public async ask(message: string): Promise<any> {
        // https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?bl=boq_assistant-bard-web-server_20230521.19_p0&_reqid=259948&rt=c
        const params = {
            bl: "boq_assistant-bard-web-server_20230521.19_p0",
            _reqid: this.reqid.toString(),
            rt: "c",
        };

        const url = `https://bard.google.com/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?${new URLSearchParams(params).toString()}`

        const payload = [
            [message, null, null, []],
            ["en-GB"],
            [this.conversation_id, this.response_id, this.choice_id],
        ];

        const data = {
            "f.req": JSON.stringify([null, JSON.stringify(payload)]),
            at: this.SNlM0e
        };

        try {
            const resp = await got.post(
                url,
                { form: data, headers: this.headers }
            );

            const chat_data = JSON.parse(resp.body.split("\n")[3])[0][2];
            if (!chat_data) {
                return { content: `Bot encountered an unknown error while extracting chat data`, body: resp.body };
            }
            const json_chat_data = JSON.parse(chat_data);
            const results = {
                content: json_chat_data[0][0],
                conversation_id: json_chat_data[1][0],
                response_id: json_chat_data[1][1],
                factualityQueries: json_chat_data[3],
                textQuery: json_chat_data[2] ? json_chat_data[2][0] : "",
                choices: json_chat_data[4].map((i: any) => ({ id: i[0], content: i[1] })),
            };
            this.conversation_id = results.conversation_id;
            this.response_id = results.response_id;
            this.choice_id = results.choices[0].id;
            this.reqid += 100000;
            return results;
        } catch (error) {
            throw error;
        }
    }
}

export default Bard;
