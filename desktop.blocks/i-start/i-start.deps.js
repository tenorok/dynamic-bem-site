({
    mustDeps: [
        { block: 'vow', mods: { dummy: 'yes' } },
        { block: 'i-bem' },
        { block: 'mongo' }
    ],
    shouldDeps: [
        { block: 'page' },
        { block: 'contacts' }
    ]
})
