export interface IController {
    execute(dto: any): Promise<any>
}