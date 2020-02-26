exports.setup = () => {
    process.env.RUN = 'TEST';
    process.env.TOKEN = './tests/Administration/dummy.token';
    process.env.FILES = './tests/Administration/';
}