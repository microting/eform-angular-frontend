interface String {
  replaceAll(search: string, replacement: string): string;
}

String.prototype.replaceAll = function(search: string, replacement: string): string {
  return this.replace(new RegExp(search, 'g'), replacement);
}
