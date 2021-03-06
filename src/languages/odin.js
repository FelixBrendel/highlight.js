/*
Language: Odin
Author: Felix Brendel <felix@brendel.engineering>
Date: 9.July.2017
Description: Language support for Odin by
Category: system
*/

function(hljs) {
    // TODO(Felix): make types a separate string
    var ODIN_KEYWORDS = {
        keyword:
            'import export foreign foreign_library foreign_system_library ' +
            'when if else for match in do case break continue fallthrough defer return ' +
            'macro proc struct enum union bit_field vector map dynamic static ' +
            'using context push_context push_allocator ' +
            'size_of align_of offset_of type_of type_info_of ' +
            'cast transmute ' +
            'bool rune ' +
            'i8 i16 i32 i64 i128 int ' +
            'u8 u16 u32 u64 u128 uint ' +
            'f16 f32 f64 ' +
            'complex32 complex64 complex128 ' +
            'rawptr string any ' +
            'asm yield await atomic',

        literal:
            'true false nil --- ',
    };

    ODIN_BUILTINS = '\\b(len|cap|new|make|free|reserve|clear|append|pop|delete|compile_assert|assert|panic|' +
                    'copy|swizzle|complex|real|imag|conj|expand_to_tuple|min|max|abs|clamp|transmute)(?!\\w|(\\s*[^\\(]))'

    // ODIN_BUILTINS = /[^\w](len|cap|new|make|free|reserve|clear|min|max)(?!\w|(\s*[^\(]))/
    ODIN_BUILTINS_RE = {
        className: 'built_in',
        begin:  ODIN_BUILTINS
    }

    ODIN_COMMENT_RE = {
        className: 'comment',
        variants: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE
        ]
    }

    ODIN_NUMBER_RE = {
        className: 'number',
        variants: [
            {begin: hljs.C_NUMBER_RE + '[dflsi]', relevance: 1}, // TODO(Felix): check allowed chars after number
            hljs.C_NUMBER_MODE
        ]
    }

    ODIN_HASHKEYWORD_RE = { // hash keywords in parameters
        className: 'keyword',
        begin: '#\\s*\\S',
        end: ';|\\s|\\)',
        returnBegin: true,
        returnEnd: false,
        excludeEnd: true,
    }

    ODIN_STRING_RE = {
        className: 'string',
        variants: [
            hljs.QUOTE_STRING_MODE,
            {begin: '\'', end: '[^\\\\]\''},
            {begin: '"', end: '[^\\\\]"'},
        ]
    }

    ODIN_VAR_DECL_RE = { // variables and parameters
        begin: /(?!:(?=\s*\S*\s*:)):\s*(=\s*)?(\.\.\.\s*)?(\^\s*)?(\[\s*\]\s*)?/,
        end: /,|=|\)|\}|;/,
        endsWithParent: true,
        excludeEnd: true,
        returnEnd:  false,
        returnBegin: true,
        contains : [
            // {
            //     className: "type",
            //     begin: /:\s*(\.\.\.\s*)?(\^\s*)?(\[\]\s*)?(?!proc)/,
            //     end: /=|\s/,
            //     endsWithParent: true,
            //     excludeBegin: true,
            //     returnBegin: false,
            //     excludeEnd: true,
            //     keywords: ODIN_KEYWORDS, // TODO(Felix): use ODIN_TYPES
            // },
            ODIN_NUMBER_RE,
            ODIN_HASHKEYWORD_RE,
            ODIN_STRING_RE,
            ODIN_COMMENT_RE
        ],
        keywords: ODIN_KEYWORDS,
    },

    ODIN_RETURN_TYPE_RE = {
        begin: /->\s*(\^\s*)?(\s*\[\s*\])?\s*/,
        end: /\r|\n/,
        // end: /\)|,/,
        endsWithParent: true,
        excludeEnd: true,
        returnEnd:  false,
        contains: [
            {
                className: 'type',
                begin: /(!:\s*proc)\s*\S/,
                endsWithParent: true,
                returnBegin: true,
                returnEnd: false,
                excludeEnd: true,
                keywords: ODIN_KEYWORDS, // TODO(Felix): use ODIN_TYPES
            },
            ODIN_HASHKEYWORD_RE,
            ODIN_VAR_DECL_RE
        ],
        keywords: ODIN_KEYWORDS
    }

    // ODIN_PARAMS_RE = { // parameters
    //     begin: /\(/,
    //     end: /\)/,
    //     excludeBegin: true,
    //     excludeEnd: true,
    //     contains: [
    //         {
    //             begin: /\s*:(\s*=)?\s*(\.\.\.\s*)?(\^\s*)?(\[\s*\]\s*)?/,
    //             end: /,/,
    //             endsWithParent: true,
    //             excludeEnd: true,
    //             returnEnd:  false,
    //             returnBegin: true,
    //             contains : [
    //                 {
    //                     className: "type",
    //                     begin: /:\s*(\.\.\.\s*)?(\^\s*)?(\[\]\s*)?(?!proc)/,
    //                     end: /=|\s/,
    //                     endsWithParent: true,
    //                     excludeBegin: true,
    //                     returnBegin: false,
    //                     excludeEnd: true,
    //                     keywords: ODIN_KEYWORDS, // TODO(Felix): use ODIN_TYPES
    //                 },
    //                 ODIN_NUMBER_RE,
    //                 ODIN_HASHKEYWORD_RE
    //             ],
    //             keywords: ODIN_KEYWORDS,
    //         },
    //     ],
    //     keywords: ODIN_KEYWORDS,
    // }


    ODIN_PROC_RE = { // procs
            begin: /[a-zA-Z0-9_][\w]*\s*:\s*:\s*(proc)\s*/,
            end: /\{|do|---/,
            returnBegin: true,
            excludeBegin: false,
            returnEnd: false,
            excludeEnd: true,
            contains: [
                { // the procs name
                    className: 'function',
                    begin: /[a-zA-Z0-9_].*(?:\s*:\s*:)/,
                    end: /\s/,
                    endsWithParent: true,
                    returnBegin: true,
                    contains : [
                        hljs.TITLE_MODE // TODO(Felix): include leading underscores
                    ],
                },
                ODIN_VAR_DECL_RE,
                ODIN_RETURN_TYPE_RE,
                ODIN_HASHKEYWORD_RE
            ],
            keywords: ODIN_KEYWORDS
    }

    // HACK HACK HACK
    // ODIN_RETURN_TYPE_RE.contains.push(ODIN_PARAMS_RE);

    return {
        aliases: ['odinlang'],
        keywords: ODIN_KEYWORDS,
        contains: [
            ODIN_COMMENT_RE,
            ODIN_STRING_RE,
            ODIN_HASHKEYWORD_RE,
            ODIN_NUMBER_RE,
            ODIN_BUILTINS_RE,
            // { // function calls
            //     className: 'function',
            //     begin: /[a-zA-Z0-9_][\w]*\s*\(/,
            //     end: /\(/,
            //     excludeBegin:false,
            //     returnBegin: true,
            //     excludeEnd: true,
            //     returnEnd: false,
            //     keywords: ODIN_KEYWORDS,
            //     contains : [
            //         hljs.TITLE_MODE // TODO(Felix): include leading underscores
            //     ],
            // },
            ODIN_VAR_DECL_RE,
            { // structs
                begin: /[a-zA-Z0-9_][\w]*\s*:\s*:\s*(struct|enum|union|raw_union|bit_field)/,
                end: /\{/,
                returnBegin: true,
                contains: [
                    { // the word struct|enum|union|raw_union|bit_field
                        className: 'keywords',
                        begin: /struct|enum|union|raw_union|bit_field/,
                        keywords: "struct enum union raw_union bit_field",
                    },
                    { // struct name
                        className: 'type',
                        begin: /[a-zA-Z0-9_]/,
                        end: /\s/,
                    },
                    ODIN_HASHKEYWORD_RE,
                ]
            },
            ODIN_PROC_RE
        ]
    };
}
