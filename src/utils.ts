export const parseCssRules = function (cssText: string) {
    const tokenizer = /\s*([a-z\-]+)\s*:\s*((?:[^;]*url\(.*?\)[^;]*|[^;]*)*)\s*(?:;|$)/gi;
    const obj: any = {};
    let token;
    while ( (token=tokenizer.exec(cssText)) ) {
       obj[token[1].toLowerCase()] = token[2];
    }
   return obj;
};