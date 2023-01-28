export function invalidForm(form, listOfErrors) {
    let countEmptyInput = Object.keys(form).filter(el => form[el] === '').length

    let countMsg = Object.keys(listOfErrors).filter(el => listOfErrors[el] != '').length

    return countEmptyInput || countMsg
}