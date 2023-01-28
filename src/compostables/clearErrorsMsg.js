export function clearErrorsMsg(e, listOfErrors, form, invalidForm) {
    const field = e.target.name;
    if (invalidForm[field] == undefined ||
        listOfErrors[field] == undefined ||
        form[field] == undefined)
        return;

    if (listOfErrors[field].length && invalidForm[field] != form[field])
        listOfErrors[field] = []
}
