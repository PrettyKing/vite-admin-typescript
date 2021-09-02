import { modules } from './modules'

//=========================== getters ========================================

type GetGetter<Module> = Module extends { getters: infer G } ? G : unknown;

type GetGetters<Modules> = {
    [K in keyof Modules]: GetGetter<Modules[K]>;
}

type ModuleGetters = GetGetters<typeof modules>;

type AddPrefxi<P, K> = `${P & string}/${K & string}`
type GetSpliceKey<M, K> = AddPrefxi<K, keyof M>
type GetSpliceKeys<Modules> = {
    [K in keyof Modules]: GetSpliceKey<Modules[K], K>;
}[keyof Modules]

// type xx = GetSpliceKeys<ModuleGetters>;

type GetFunc<T, A, B> = T[A & keyof T][B & keyof T[A & keyof T]]
type GetSpliceObj<T> = {
    [K in GetSpliceKeys<T>]: K extends `${infer A}/${infer B}` ? GetFunc<T, A, B> : unknown;
}
type FinalModulesGetters = GetSpliceObj<ModuleGetters>;

type Getters = {
    [K in keyof FinalModulesGetters]: ReturnType<FinalModulesGetters[K]>
}

//=========================== Dispatchs Actions========================================

type GetMutations<Module> = Module extends { actions: infer M } ? M : never

type AddPrefix<Prefix, Keys> = `${Prefix & string}/${Keys & string}`

type GetSubModuleKeys<Module, Key> = Module extends { modules: infer SubModules }
    ? AddPrefix<Key, GetModulesMutationKeys<SubModules>>
    : never

type GetModuleMutationKeys<Module, Key> = AddPrefix<Key, keyof GetMutations<Module>> | GetSubModuleKeys<Module, Key>

type GetModulesMutationKeys<Modules> = {
    [K in keyof Modules]: GetModuleMutationKeys<Modules[K], K>
}[keyof Modules]

type Action = GetModulesMutationKeys<typeof modules>

export {
    Getters,
    Action,
}