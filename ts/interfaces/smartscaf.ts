export interface ISmartscafFile {
  defaults: {[key:string]: string};
  dependencies: {
    merge: string[];
  };
  runafter: string[];
}