import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'

// Define custom theme preset based on Aura
const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            50: '{slate.50}',
            100: '{slate.100}',
            200: '{slate.200}',
            300: '{slate.300}',
            400: '{slate.400}',
            500: '{slate.500}',
            600: '{slate.600}',
            700: '{slate.700}',
            800: '{slate.800}',
            900: '{slate.900}',
            950: '{slate.950}'
        }
    },

    components: {
        tabs: {
            root: {
                borderColor: '{surface.border.color}',
                padding: '0.25rem'
            },

            tablist: {
                gap: '0.25rem'
            },

            tab: {
                borderRadius: '0.5rem',
                padding: '0.5rem 1rem',
                fontWeight: 'normal',

                background: 'transparent',
                hoverBackground: '{primary.100}',

                activeColor: '{primary.600}',
                activeBorderColor: '{primary.600}',
            },

            activeBar: {
                height: '2px',
                borderRadius: '2px',
                background: '{primary.600}',
            }
        }
    }
})

export default MyPreset
