export interface IAdapter {
    execute(dto: any): Promise<any>
}