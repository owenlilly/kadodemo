import * as mongoose from 'mongoose';

export function docToObject<T>(document: mongoose.Document, idAlias?: string): T {
    return document.toObject({
        versionKey: false,
        transform: (doc, obj) => {
            if (idAlias && doc._id) {
                obj[idAlias] = obj._id.toHexString();
                obj = omit(obj, '_id')
            }
            return obj;
        },
    });
}

export function omit<T>(obj: T, fieldName: string): T {
    delete obj[fieldName];
    return obj;
}
