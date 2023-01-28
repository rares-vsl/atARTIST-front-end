export function parseSuccessMsg(response) {
    const data = response.data.data

    if (Object.hasOwn(data, 'message')) {
        return {
            location: '',
            msg: data.message,
            status: 'success'
        }
    }
}