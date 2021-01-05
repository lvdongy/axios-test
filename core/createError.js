export function createError(response){
    console.log(response);
    return {
        status: response.status,
        message: 'Request failed with status code ' + response.status,
    }
}
