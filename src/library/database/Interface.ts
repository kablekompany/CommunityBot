import type { Document, Schema, Model } from 'mongoose';

/**
 * Where all properties and stuff are declared.
 */
export interface IProps {}

/**
 * The base document interface.
 */
export interface IBaseDocument extends IProps, Document {
  /**
   * The ID of the document.
   */
  _id: string;
}

/**
 * The main document.
 */
export interface IDocument extends IBaseDocument {}

/**
 * The model interface where static methods can be declared.
 * @template T - The document type.
 */
export interface IModel<T extends IDocument> extends Model<T> {}
