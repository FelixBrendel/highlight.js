/*
Language: Odin
Author: Felix Brendel <felix@brendel.engineering>
Description: Language Odin by github.com/gingerBill
Category: system
*/

function(hljs) {
  var ODIN_KEYWORDS = {
    keyword:
	  'import import_load foreign foreign_library ' +
	  'when if else for match in do case break continue fallthrough defer return ' +
	  'macro struct union raw_union enum bit_field vector map dynamic static ' +
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
    illegal: '</',
    contains: [
      hljs.C_LINE_COMMENT_MODE,
      hljs.C_BLOCK_COMMENT_MODE,
      {
        className: 'string',
        variants: [
          hljs.QUOTE_STRING_MODE,
          {begin: '\'', end: '[^\\\\]\''},
          {begin: '"', end: '"'},
        ]
      },
      {
        className: 'keyword',
        begin: '#\\s*\\S',
        end: '\\s'
      },
      {
        className: 'number',
        variants: [
          {begin: hljs.C_NUMBER_RE + '[dflsi]', relevance: 1},
          hljs.C_NUMBER_MODE
        ]
	},
      {
        className: 'function',
        begin: /\S*\s*:\s*:\s*(proc)/, end: /\s*(->|\{|do|---)/, excludeEnd: true,
        returnBegin: true,
        contains: [
          hljs.TITLE_MODE,
          {
            className: 'params',
            begin: /\(/, end: /\)/,
            keywords: ODIN_KEYWORDS,
            illegal: /["']/
          }
        ]
      }
    ]
  };
}
