// import { Injectable } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
// import { InvoiceEvents } from '../events/user.event';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { InvoiceLogs } from './entity/log.entity';
// import { Invoice } from '../userPortal/invoice/entity/invoice.entity';
// import { User } from '../user/models/user.entity';


// type InvoiceLogPayload = {
//     invoice: Invoice
//     initiator: User
// }
// @Injectable()
// export class LogEventHandlerService {

//     constructor(
//         @InjectModel(InvoiceLogs.name, 'activityLogs-db')
//         private invoiceLogsModel: Model<InvoiceLogs>,
//     ){}

//     @OnEvent(InvoiceEvents.INVOICE_CREATED, {async: true})
//     async mailUserSuspension(payload: InvoiceLogPayload){
//         let invoiceLog: InvoiceLogs = await this.invoiceLogsModel.create({
//             createdOn: new Date()
//         ,   action: "created"
//         ,   action_meta: "..."
//         ,   initiator: payload.initiator
//         ,   invoice:  payload.invoice
//         ,   business: payload.invoice.business
//         ,   type: "INVOICE"
//         })
        
//         const message: string = `LogService : 
//             DB : activityLog-db
//             Collection : invoiceLogs
//             Log ID : ${invoiceLog.id}
//             ${invoiceLog.type} ${invoiceLog.action} By ${invoiceLog.initiator}
//         `;
//         console.log(message)
//     }
    
// }