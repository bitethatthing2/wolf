// This function is no longer used as we've migrated from Elfsight to direct implementations

/**
 * A simple placeholder that returns a deprecation message
 */
exports.handler = async function(event, context) {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    },
    body: JSON.stringify({
      message: 'Elfsight proxy has been deprecated. We now use direct Instagram and Google integrations.'
    })
  };
};