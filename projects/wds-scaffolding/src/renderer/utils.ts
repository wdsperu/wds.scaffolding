export function utilsGetJsonByPath(data: any, path: string) {
    return path.split('.').reduce((t, e) => {
        t = t[e];
        return t;
    }, data)
}