const text = [
    {
        id: 1,
        name: 'Первая задача',
        paragraph: 'Моя первая задача',
        diedline: '24.12.2024',
        wordDecided: false,
        todoLists: [
            {
                id: 1,
                workText: 'Помыть посуду',
                workDecided: false,
            },
            {
                id: 2,
                workText: 'Ураться дома',
                workDecided: false,
            },
            {
                id: 3,
                workText: 'Проснуться в 9.00',
                workDecided: true,
            },
            {
                id: 4,
                workText: 'Сделать зарядку',
                workDecided: true,
            },
        ]
    },
]

export default text;