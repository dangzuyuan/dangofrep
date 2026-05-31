import { useEffect } from "react";
import { md_emitter } from "mdye";
import { EMITTER_NEW_RECORD, EMITTER_DELETE_RECORD, EMITTER_UPDATE_RECORD } from "../utils/constants";

export default function useAutoRefresh(isSilentReloadRef, setRefreshKey) {
  useEffect(function() {
    var handleRecordChange = function() {
      isSilentReloadRef.current = true;
      setRefreshKey(function(k) { return k + 1; });
    };

    md_emitter.addListener(EMITTER_NEW_RECORD, handleRecordChange);
    md_emitter.addListener(EMITTER_DELETE_RECORD, handleRecordChange);
    md_emitter.addListener(EMITTER_UPDATE_RECORD, handleRecordChange);

    return function() {
      md_emitter.removeListener(EMITTER_NEW_RECORD, handleRecordChange);
      md_emitter.removeListener(EMITTER_DELETE_RECORD, handleRecordChange);
      md_emitter.removeListener(EMITTER_UPDATE_RECORD, handleRecordChange);
    };
  }, []);
}
