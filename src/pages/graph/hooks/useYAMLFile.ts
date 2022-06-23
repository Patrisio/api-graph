import { useEffect, useState, useMemo, useCallback } from "react";
import { DOWNLOAD_FILE_INPUT } from "../common/constants";
import {HOST} from '../../../config';

export const useYAMLFile = () => {
  const [yaml, setYaml] = useState(null);
  const [yaml2json, setYaml2Json] = useState(null);

  const getYAMLFile = useCallback(async () => {
    const inputElement = document.getElementById(DOWNLOAD_FILE_INPUT);

    if (!inputElement) return;

    const yamlFileBlob = (inputElement as any).files[0];

    setYaml(yamlFileBlob);
  }, []);

  useEffect(() => {
    if (!yaml) return;
    const getFrontApi = async () => {
      const formData = new FormData();

      const arrayBuffer = await (yaml as any).arrayBuffer();
      const myBlob = new Blob([new Uint8Array(arrayBuffer)], {
        type: (yaml as any).type,
      });
      formData.append("yaml", myBlob, (yaml as any).name);

      const response = await fetch(`${HOST}/getData`, {
        method: "POST",
        body: formData,
      });
      const yaml2json = await response.json();
      setYaml2Json(yaml2json);
    };

    getFrontApi();
  }, [yaml]);

  return useMemo(
    () => ({
      getYAMLFile,
      yaml: yaml2json,
    }),
    [getYAMLFile, yaml2json]
  );
};
