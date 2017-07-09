/*
Language: Odin
Author: Felix Brendel <felix@brendel.engineering>
Description: Language Odin by github.com/gingerBill
Category: system
*/

function(hljs) {
    // TODO(Felix): make types a separate string
  var ODIN_KEYWORDS = {
    keyword:
      'import import_load foreign foreign_library ' +
      'when if else for match in do case break continue fallthrough defer return ' +
      'macro proc struct enum union raw_union bit_field vector map dynamic static ' +
      'using context push_context push_allocator link_name' +
      'size_of align_of offset_of type_of type_info ' +
      'asm yield await atomic ' +
      'bool rune i8 i16 i32 i64 i128 u8 u16 u32 u64 u128 int uint f16 f32 f64 ' +
      'complex32 complex64 complex128 rawptr string any ',
    literal:
      'true false nil ---',
    built_in:
      'len cap new make free reserve clear append pop delete compile_assert assert panic ' +
      'copy swizzle complex real imag conj expand_to_tuple min max abs clamp transmute '
  };

  var PROC_NAME = hljs.IDENT_RE;

    return {
        aliases: ['odinlang'],
        keywords: ODIN_KEYWORDS,
        contains: [
            hljs.C_LINE_COMMENT_MODE,
            hljs.C_BLOCK_COMMENT_MODE,
            {
                className: 'string',
                variants: [
                    hljs.QUOTE_STRING_MODE,
                    {begin: '\'', end: '[^\\\\]\''},
                    {begin: '"', end: '[^\\\\]"'},
                ]
            },
            { // hash keywords
                className: 'keyword',
                begin: '#\\s*\\S',
                returnBegin: true,
                end: '\\s'
            },
            // { // function calls
            //     className: 'function',
            //     begin: /[a-zA-Z0-9_][\w]*\(/,
            //     end: /\(/,
            //     returnBegin: true,
            //     excludeEnd: true,
            //     returnEnd: false,
            //     contains : [
            //         hljs.TITLE_MODE // TODO(Felix): include leading underscores
            //     ],
            //     keywords: ODIN_KEYWORDS,
            // },
            {
                className: 'number',
                variants: [
                    {begin: hljs.C_NUMBER_RE + '[dflsi]', relevance: 1}, // TODO(Felix): check allowed chars after number
                    hljs.C_NUMBER_MODE
                ]
            },
            {
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
                    }
                ]
            },
            { // normal procs
                begin: /[a-zA-Z0-9_][\w]*\s*:\s*:\s*(proc)/,
                end: /;|\{|do|---/,
                returnBegin: true,
                excludeBegin: false,
                returnEnd: false,
                excludeEnd: true,
                contains: [
                    { // the procs name
                        className: 'function',
                        begin: /[a-zA-Z0-9_]*\s/,
                        end: /\s/,
                        returnBegin: true,
                        contains : [
                            hljs.TITLE_MODE // TODO(Felix): include leading underscores
                        ]
                    },
                    { // the return type
                        begin: /->(\s*\^\s*)?(\s*\[\s*\])?\s*/,
                        endsWithParent: true,
                        excludeEnd: true,
                        returnEnd:  true,
                        contains: [
                            {
                                className: 'type',
                                begin: /\S/,
                                endsWithParent: true,
                                returnBegin: true,
                                returnEnd: false,
                                excludeEnd: true,
                                keywords: ODIN_KEYWORDS, // TODO(Felix): use ODIN_TYPES
                            },
                        ]
                    },
                    { // parameters
                        begin: /\(/,
                        end: /\)/,
                        excludeBegin: true,
                        excludeEnd: true,
                        contains: [
                            // { // proc as parameter
                            //     begin: /proc\s*\(/,
                            //     end: /\)/,
                            //     returnBegin: false,
                            //     returnEnd: false,
                            //     keywords: "proc",
                            //     keywords: ODIN_KEYWORDS,
                            // },
                            {
                                className: 'type',
                                begin: /\:(\s*(\.\.\.|\^|\[\]))?/,
                                end: /,/,
                                endsWithParent: true,
                                excludeBegin: true,
                                excludeEnd: true,
                                returnEnd:  false,
                                returnBegin:false,
                                keywords: ODIN_KEYWORDS, // TODO(Felix): use ODIN_TYPES
                            },
                            // { // hash keywords in parameters
                            //     className: 'keyword',
                            //     begin: '#\\s*\\S',
                            //     end: ';|\\s',
                            //     returnBegin: true,
                            //     returnEnd: false,
                            //     excludeEnd: true,
                            // },

                        ],
                        keywords: ODIN_KEYWORDS,
                    },
                ],
                keywords: ODIN_KEYWORDS
            },

        ]
    };
}
