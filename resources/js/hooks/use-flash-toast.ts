import { router } from '@inertiajs/react';
import { createElement, useEffect } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            const description = data.link
                ? createElement(
                      'span',
                      null,
                      data.description + ' ',
                      createElement(
                          'a',
                          { href: data.link.url, target: '_blank', rel: 'noopener noreferrer', className: 'underline' },
                          data.link.label,
                      ),
                  )
                : data.description;

            toast[data.type](data.message, { description });
        });
    }, []);
}
