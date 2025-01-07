//base by DGXeon
//re-upload? recode? copy code? give credit ya :)
//YouTube: @DGXeon
//Instagram: unicorn_xeon13
//Telegram: t.me/xeonbotinc
//GitHub: @DGXeon
//WhatsApp: +916909137213
//want more free bot scripts? subscribe to my youtube channel: https://youtube.com/@DGXeon

let axios = require('axios')
let BodyForm = require('form-data')
let { fromBuffer } = require('file-type')
let fetch = require('node-fetch')
let fs = require('fs')
let cheerio = require('cheerio')


async function TelegraPh(Path) {
    if (!fs.existsSync(Path)) {
        throw new Error("File not found at the specified path.");
    }

    try {
        const form = new BodyForm();
        form.append("file", fs.createReadStream(Path));

        const response = await axios.post("https://telegra.ph/upload", form, {
            headers: {
                ...form.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            timeout: 10000, // Add a timeout to handle delays
        });

        // Log the full response for debugging
        console.log("Telegraph response:", response.data);

        if (response.data && Array.isArray(response.data) && response.data[0].src) {
            return "https://telegra.ph" + response.data[0].src;
        } else {
            throw new Error("Invalid response format from Telegra.ph");
        }
    } catch (err) {
        console.error("Telegraph API error:", err.response ? err.response.data : err.message);
        throw err;
    }
}
async function UploadFileUgu(input) {
    if (!fs.existsSync(input)) {
        throw new Error("File not found at the specified path.");
    }

    try {
        const form = new BodyForm();
        form.append("files[]", fs.createReadStream(input));

        const response = await axios.post("https://uguu.se/upload.php", form, {
            headers: {
                ...form.getHeaders(),
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            },
            timeout: 10000, // Add a timeout to handle delays
        });

        // Log the full response for debugging
        console.log("Uguu.se response:", response.data);

        if (response.data && response.data.success && response.data.files) {
            return response.data.files[0].url; // Adjust this based on API documentation
        } else {
            throw new Error("Invalid response format from Uguu.se");
        }
    } catch (err) {
        console.error("Uguu.se API error:", err.response ? err.response.data : err.message);
        throw err;
    }
}
function webp2mp4File(path) {
	return new Promise((resolve, reject) => {
		 const form = new BodyForm()
		 form.append('new-image-url', '')
		 form.append('new-image', fs.createReadStream(path))
		 axios({
			  method: 'post',
			  url: 'https://s6.ezgif.com/webp-to-mp4',
			  data: form,
			  headers: {
				   'Content-Type': `multipart/form-data; boundary=${form._boundary}`
			  }
		 }).then(({ data }) => {
			  const bodyFormThen = new BodyForm()
			  const $ = cheerio.load(data)
			  const file = $('input[name="file"]').attr('value')
			  bodyFormThen.append('file', file)
			  bodyFormThen.append('convert', "Convert WebP to MP4!")
			  axios({
				   method: 'post',
				   url: 'https://ezgif.com/webp-to-mp4/' + file,
				   data: bodyFormThen,
				   headers: {
						'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
				   }
			  }).then(({ data }) => {
				   const $ = cheerio.load(data)
				   const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
				   resolve({
						status: true,
						message: "Xeorz",
						result: result
				   })
			  }).catch(reject)
		 }).catch(reject)
	})
}

async function floNime(medianya, options = {}) {
const { ext } = await fromBuffer(medianya) || options.ext
        var form = new BodyForm()
        form.append('file', medianya, 'tmp.'+ext)
        let jsonnya = await fetch('https://flonime.my.id/upload', {
                method: 'POST',
                body: form
        })
        .then((response) => response.json())
        return jsonnya
}

module.exports = { TelegraPh, UploadFileUgu, webp2mp4File, floNime }
