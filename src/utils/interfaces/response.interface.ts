import { Page as PageT } from "../types"

export interface ApiResponse {
    message:    string
    data:       object
    code:       string | null
    errors:     any | null

}

export interface Page {
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

export interface PaginatedApiResponse {
    message:    string
    data:       object
    code:       string | null
    errors:     any | null
    page:       PageT
}
