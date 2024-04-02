export type ApiResponseT = {
    message:    string
    data:       object
    code:       string | null
    errors:     any | null
}

export type Page = {
    previous:   number
    current:    number
    next:       number
    total:      number
    size:       number
    records:    {
                    total:  number
                    onPage: number
                }
}

export type PaginatedApiResponse = {
    message:    string
    data:       object
    code:       string | null
    errors:     any | null
    page:       Page
}
