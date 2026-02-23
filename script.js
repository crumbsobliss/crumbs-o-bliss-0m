import { env } from 'process';
puppeteer.launch({ executablePath: '/usr/bin/google-chrome-stable', args: ['--no-sandbox', '--disable-setuid-sandbox'] }).then(b => { console.log('success'); b.close() }).catch(e => console.error(e))
