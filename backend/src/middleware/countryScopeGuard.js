const normalizeCountry = (value) => {
  if (!value) {
    return '';
  }

  const normalized = String(value).trim().toLowerCase();

  if (normalized === 'india') {
    return 'India';
  }

  if (normalized === 'america') {
    return 'America';
  }

  return value;
};

const isCountryAllowed = (user, resourceCountry) => {
  if (!user) {
    return false;
  }

  if (user.role === 'admin') {
    return true;
  }

  return normalizeCountry(resourceCountry) === normalizeCountry(user.country);
};

const enforceCountryScope = (options = {}) => {
  const {
    readFromBody = true,
    readFromQuery = true,
    readFromParams = true,
    strict = false
  } = options;

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. User context is missing.'
      });
    }

    if (req.user.role === 'admin') {
      return next();
    }

    const candidates = [];

    if (readFromBody && req.body && req.body.country) {
      candidates.push(req.body.country);
    }

    if (readFromQuery && req.query && req.query.country) {
      candidates.push(req.query.country);
    }

    if (readFromParams && req.params && req.params.country) {
      candidates.push(req.params.country);
    }

    if (req.resourceCountry) {
      candidates.push(req.resourceCountry);
    }

    if (candidates.length === 0) {
      if (strict) {
        return res.status(400).json({
          success: false,
          message: 'country is required for this operation'
        });
      }

      req.countryScope = req.user.country;
      return next();
    }

    const hasOutOfScopeCountry = candidates.some(
      (country) => normalizeCountry(country) !== normalizeCountry(req.user.country)
    );

    if (hasOutOfScopeCountry) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden. Cross-country access is not allowed for your role.'
      });
    }

    req.countryScope = req.user.country;
    return next();
  };
};

module.exports = {
  enforceCountryScope,
  isCountryAllowed,
  normalizeCountry
};
