const regex = /[1-4].?[bd(?:mr|zsv|fymed)]|[2-4].?[abd(?:mr|zsv|fymed)]|sbor|maturit|sch(?:u|ů|ú)zk/;
// /[1-4].?[bd(?:mr|zsv|fymed)]|[2-4].?[abd(?:mr|zsv|fymed)]|sbor|maturit|sch(?:u|ů|ú)zk/i
const string = '1aj1';

console.log(regex.test(string));
