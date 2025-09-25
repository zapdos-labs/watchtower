import { IconTypes } from "solid-icons";
import * as allBsIcons from "solid-icons/bs";
import * as allFaIcons from "solid-icons/fa";
import { Component } from "solid-js";

export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

export function getBsIcon(iconKey: string): IconTypes {
    // 1. Construct the key for the icon object.
    // Icon names in the `solid-icons` library are exported in PascalCase, prefixed with "Bs".
    // e.g., "cloud" becomes "BsCloud", "arrowLeft" becomes "BsArrowLeft".
    // const iconKey = `Bs${name.charAt(0).toUpperCase() + name.slice(1)}`;

    // 2. Look up the icon component in the imported object of all icons.
    // We cast the imported module to a record of string keys and Component values for type safety.
    const IconComponent = iconKey.startsWith('Bs') ?

        (allBsIcons as Record<string, Component>)[iconKey] :

        (allFaIcons as Record<string, Component>)[iconKey];

    // 3. Return the found component, or the fallback icon if the key does not exist.
    return IconComponent || allBsIcons.BsCloudFill;
}

