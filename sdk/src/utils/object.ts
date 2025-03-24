import { SuiMoveObject, SuiObjectData, SuiObjectResponse, SuiParsedData } from '@mysten/sui/client';
import type { Infer } from 'superstruct';
import { any, record, string } from 'superstruct';

export const ObjectContentFields = record(string(), any());
export type ObjectContentFields = Infer<typeof ObjectContentFields>;

export interface SuiObjectDataWithContent extends SuiObjectData {
  content: SuiParsedData;
}

function isSuiObjectDataWithContent(data: SuiObjectData): data is SuiObjectDataWithContent {
  return data.content !== undefined;
}

export function getSuiObjectData(resp: SuiObjectResponse): SuiObjectData | null | undefined {
  return resp.data;
}

export function getMoveObject(data: SuiObjectResponse | SuiObjectData): SuiMoveObject | undefined {
  const suiObject = 'data' in data ? getSuiObjectData(data) : (data as SuiObjectData);

  if (!suiObject || !isSuiObjectDataWithContent(suiObject) || suiObject.content.dataType !== 'moveObject') {
    return undefined;
  }

  return suiObject.content as SuiMoveObject;
}

export function getObjectFields(
  resp: SuiObjectResponse | SuiMoveObject | SuiObjectData,
): ObjectContentFields | undefined {
  if ('fields' in resp) {
    return resp.fields;
  }

  return getMoveObject(resp)?.fields;
}

export const getObjectGenerics = (resp: SuiObjectResponse): string[] => {
  const objType = resp.data?.type;

  const startIdx = objType?.indexOf?.('<');
  const endIdx = objType?.lastIndexOf?.('>');

  return startIdx ? objType!.slice(startIdx + 1, endIdx).split(', ') : [];
};
