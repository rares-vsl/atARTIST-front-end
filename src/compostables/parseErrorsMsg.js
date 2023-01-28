

export function parseErrorsMsg(response, listOfErrors, form) {
    const data = response.data.data

    if (Object.hasOwn(data, 'errors')) {
        let errors = data.errors
        
        for (var key in errors) {
            if (Object.keys(listOfErrors).includes(key))
                listOfErrors[key] = errors[key]
        }
    }

    return Object.assign({}, form)
}