export interface IDomainService {
    execute(dto: any): Promise<any>
}