import express from "express";
import path from "path";
import request from "request-promise";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/download', async (req, res) => {
    const tiktokUrl = req.body.url;

    if (!tiktokUrl) {
        return res.json({ status: "error", message: "URL is required" });
    }

    const options = {
        url: 'https://www.tikwm.com/api/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            url: tiktokUrl,
            count: 12,
            cursor: 0,
            web: 1,
            hd: 1
        })
    };

    try {
        const response = await request(options);
        const data = JSON.parse(response);
        const msg = data.msg;

        if (msg == "success") {
            const duration = `${Math.floor(data.data.duration / 60)}:${Math.floor(data.data.duration % 60)}`;
            const size = data.data.size / 1000000;

            res.json({ status: "success",
                data: {
                    download_link: `https://www.tikwm.com${data.data.hdplay}`,
                    cover: `https://www.tikwm.com${data.data.cover}`,
                    title: (data.data.title).split("#")[0],
                    creator: data.data.author.nickname,
                    creatorId: data.data.author.unique_id,
                    duration: duration.split(":")[0] == "0" ? duration.split(":")[1] + " seconds" : duration + " minutes",
                    size: size.toFixed(2) + "MB"
                }
            });
        } else {
            res.json({ status: "error", message: data.msg });
        }
    } catch (error) {
        res.json({ status: "error", message: error.message });
    }

});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port:", port);
});