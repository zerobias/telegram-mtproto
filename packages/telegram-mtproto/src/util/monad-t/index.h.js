//@flow

export interface λType<Name> {
  typeName: Name
}

export interface λMap<Name, Value> extends λType<Name> {
  map<Valueʹ>(f: (x: Value) => Valueʹ): λMap<Name, Valueʹ>,
}

export interface λChain<Name, Value> extends λType<Name> {
  chain<Nameʹ, Valueʹ>(
    f: (x: Value) => λChain<Nameʹ, Valueʹ>
  ): λChain<Nameʹ, Valueʹ>,
}

export interface ᐸOfᐳ<Name> {
  of(v: *): λType<Name>,
}

export interface ᐸMapᐳ<Name> extends ᐸOfᐳ<Name> {
  of(v: *): λMap<Name, *>,
}

export interface ᐸChainᐳ<Name> extends ᐸOfᐳ<Name> {
  of(v: *): λChain<Name, *>,
}

export interface ᐸEmptyᐳ<Name> {
  empty(): λType<Name>,
}

export interface ᐸChainRecᐳ<Name> extends ᐸChainᐳ<Name> {
  chainRec(f: *, i: *): λType<Name>,
}

// export interface ᐸEmptyᐳ<Type>
