([{
    tech: 'js',
    shouldDeps: {
        tech: 'bemhtml',
        block: 'contacts'
    }
},
{
    mustDeps: [
        { block: 'fs' },
        { block: 'mongo' }
    ],
    shouldDeps: [
        { block: 'contact' }
    ]
}])
