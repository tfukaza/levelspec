//! AML authoring. The published artifact is XML accepted by SuperSpec's reader.
pub use superspec_aml::architecture::Document;
use superspec_aml::diagnostic::Diagnostic;

/// Opens existing AML as an editable draft and reports source-linked errors.
pub fn read(source: &str) -> Result<Document, Diagnostic> {
    superspec_profiles::parse(source)
}

/// Emits AML XML and checks it against the vocabulary used by the scene builder.
pub fn compile(draft: &Document) -> Result<String, String> {
    superspec_profiles::serialize(draft)
}
