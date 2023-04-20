import { readFile } from "node:fs/promises";
import { json } from "@remix-run/node";
import type { LoaderArgs } from "@remix-run/node";

// LANGUAGE_FORMAT doesn't cover all possible language formats.
// But it is good enough for the languages that web supports.
const LANGUAGE_FORMAT = /^[a-z]{2,4}(-[A-Z]{2})?$/;
const NAMESPACE_FORMAT = /^[A-Za-z0-9._-]+$/;

export async function loader({ request }: LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const language = searchParams.get("lng") ?? "";
  const namespace = searchParams.get("ns") ?? "";

  if (!LANGUAGE_FORMAT.test(language)) {
    return errorResponse(
      `"lng" parameter is absent or improperly formatted. It should only contain alphanumeric characters, periods, hypens and underscores`
    );
  }
  if (!NAMESPACE_FORMAT.test(namespace)) {
    return errorResponse(
      `"namespace" parameter is absent or improperly formatted. It should only contain alphanumeric characters, periods, hypens and underscores`
    );
  }

  const translations = await loadData(language, namespace);
  if (!translations) {
    return errorResponse(
      `Could not load translations for lng "${language}" and ns "${namespace}"`
    );
  }

  return json(translations, 200);
}

function loadData(language: string, namespace: string) {
  // __dirname ends up being within the build directory, not relative to this
  // source file
  const filePath = `${__dirname}/../app/locales/${namespace}/${language}.json`;

  return readFile(filePath, "utf-8").then(
    (fileContent) => JSON.parse(fileContent),
    () => null
  );
}

function errorResponse(errorMessage: string, status = 400) {
  return json({ status: "error", errorMessage }, status);
}