export function parseFailMsg(response) {
    const data = response.data.data

    if (Object.hasOwn(data, 'message')) {
        return {
            location: '',
            msg: data.message,
            status: 'fail'
        }
    }
}