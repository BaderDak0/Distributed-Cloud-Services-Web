const vocationn = require("./vocations");
const http = require("http");
const winston = require('winston');
const port = 8080;
const s = vocationn();
s.on('NEW_VOCATION', (memberID, dateID) => {
    console.log(`created new vocation with memberID = ${memberID} and dateID = ${dateID}`);
});
s.on('CANCELING_VOCATION', (memberID) => {
    console.log(`The Vocation is canceled The memberID = ${memberID} `);
});
s.on('ERRORVIEW_VOCATION', (memberID, dateID) => {
    console.log(`this person does not have a vocation The memberID = ${memberID} and dateID = ${dateID}`);
});
s.on('ERRORVIEW_VOCATIONS' ,() => {
    console.log(`there is no vocations already`);
});
const logger = new winston.createLogger({
    transports: [
        new winston.transports.File({
            level: 'info',
            filename: './logs/logs.txt',
            json: true,
        }),
        new winston.transports.File({
            level: 'error',
            filename: './logs/errors.txt',
        }),
        new winston.transports.Console,
    ],
});
exports.startserver = () => {
    const server = http.createServer().listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
    server.on('request', async (req, res) => {
        logger.info(`${req.method} ${req.url}`)
        let q = req.url;
        let url_path = q.split('/');
        let user_id = 0, i = 0;
        if (url_path[1] != 'vocations' || (url_path.length != 2 && url_path.length != 3)) {
            res.writeHead(404).write("The path is not correct");
            logger.error(`${req.method} ${req.url} && The path is not correct`);
            res.end();
            return;
        }
        if (url_path.length == 3)
            user_id = Number(url_path[2]);
        else
            user_id = 'all';
     
        const buffers = [];
        for await (const chunk of req) {
            buffers.push(chunk);
        }
        const data = Buffer.concat(buffers).toString();
        switch (req.method) {
            case 'GET':
                if (isNaN(user_id)) {
                    if (s.getnumberOfvocations() > 0) {
                        res.writeHead(200).write("sucessful\n");
                        s.getallvocations().forEach(voca => {
                            res.write(`${voca.vocationditials()}\n`)
                        });
                    }
                    else {
                        console.log("there is no vocations already");
                        logger.error(`${req.method} ${req.url} && there is no vocations already `);
                        s.emit('ERRORVIEW_VOCATIONS');
                        res.writeHead(404).write("there is no vocations already");
                    }
                }
                else {

                    if (s.viewvocation(user_id) == "-1") 
                        res.writeHead(404).write("this person does not Exist or have a vocation");
                    else
                        res.writeHead(200).write(s.viewvocation(user_id));

                }
                    

                break;
            case 'POST':
                if (!isNaN(Number(JSON.parse(data).memberid)) && !isNaN(Number(JSON.parse(data).dateid))) {
                    
                    let res_num = s.newvocation(Number(JSON.parse(data).memberid), Number(JSON.parse(data).dateid));
                    if (res_num == -1) {
                        res.writeHead(404).write("the member or the date does not exits");

                    }
                    else if (res_num == 1) {
                        res.writeHead(200).write("Booked successfully");
                    }
                    else if (res_num == 2) {
                        res.writeHead(205).write("this person Already have a vocations if you want a new vocation please update the Date");
                    }
                }
                else {
                    console.log("there is not a member_id or date_id to books to a vocation");
                    res.writeHead(404).write("there is not a member_id or date_id to books to a vocation");
                    logger.error(`${req.method} ${req.url} && there is not a member_id or date_id to books to a vocation`);
                }
                break;
            case 'PUT':
                if (!isNaN(Number(JSON.parse(data).memberid)) && !isNaN(Number(JSON.parse(data).dateid))) {

                    
                    let res_num = s.updatevocation(Number(JSON.parse(data).memberid), Number(JSON.parse(data).dateid));
                    if (res_num == -1) {
                        res.writeHead(404).write("the member or the date does not exits");

                    }
                    else if (res_num == 1) {
                        res.writeHead(200).write("Booked successfully");
                    }
                
                }
                else {
                    console.log("there is not a member_id or date_id to update the vocation");
                    res.writeHead(404).write("there is not a member_id or date_id to update the vocation");
                    logger.error(`${req.method} ${req.url} && there is not a member_id or date_id to update the vocation`);

                }
                break;
            case 'DELETE':
                if (!isNaN(user_id)) {
                    
                    if(s.deletevocation(Number(user_id))==1)
                        res.writeHead(200).write("Booking canceled");
                    else
                       res.writeHead(404).write("this person does not exits");
                }
                else {
                    console.log("there is not a member id");
                    res.writeHead(404).write("there is not a member id");
                    logger.error(`${req.method} ${req.url} && there is not a member id `);

                }
                break;

            default:
                res.writeHead(501).write("we do not support this method");
                logger.error(`${req.method} ${req.url} && we do not support this method `);
        }
        res.end()
    })
}